import React from "react";
import prisma from "libs/prisma";
import Api from "libs/api";
import type { GetServerSideProps } from "next";
import Link from "components/link";
import {
  Box,
  Button,
  chakra,
  CircularProgress,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { getLayoutProps } from "components/layouts/customer-props";
import { ArrowLeft } from "react-iconly";
import { parseJSON, format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { withSsrSession } from "libs/session";

function useCancelOrder() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const cancelOrderMutation = useMutation(
    async ({ orderId }: any) => {
      return Api().post("/orders/cancel", { orderId });
    },
    {
      onSuccess: ({ payload: result }) => {
        console.log("Result", result);
        queryClient.setQueryData(["order-details", result.id], result);
        queryClient.invalidateQueries(["store-orders"]);

        toast({
          title: "Order cancel",
          description: "Your order has been canceled",
          position: "top-right",
          status: "success",
        });
      },
      onError: (err: any) => {
        console.warn("Error cancelling order", err);

        toast({
          title: "Error cancelling order",
          description: err.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return cancelOrderMutation;
}

const Page = (props: any) => {
  const cancelOrder = useCancelOrder();
  const { data: order } = useQuery({
    queryKey: ["order-details", props.order.id],
    queryFn: async () => {},
    initialData: props.order,
    staleTime: Infinity,
  });

  const items = order.items.map((i: any) => i.productId);
  const itemDetailsQueryResp = useQuery({
    queryKey: ["productItemDetails", items],
    onError: () => console.warn("Error fetching order details from API"),
    enabled: (items?.length || 0) > 0,
    queryFn: async () => {
      const { payload } = await Api().post(`/products/details`, { items });
      return payload;
    },
    select: (data) =>
      data.map((product: any) => {
        const orderItem = order.items.find(
          (item: any) => product.id === item.productId
        );

        return {
          productId: product.id,
          quantity: orderItem?.quantity,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
        };
      }),
  });

  return (
    <Container
      maxW={{ base: "100%", md: "container.xl" }}
      px={{ base: "4", md: "16" }}
    >
      <Link href={`/orders`} borderBottom="none">
        <Stack
          direction="row"
          align="center"
          spacing={2}
          py={{ base: "4", md: "8" }}
          mt={{ base: "0", md: "8" }}
        >
          <ArrowLeft set="light" />
          <chakra.span display="inline-block" fontSize="md" fontWeight="600">
            <Text>Order Details</Text>
          </chakra.span>
        </Stack>
      </Link>

      <chakra.section>
        <Stack
          direction="row"
          align="center"
          justify="space-between"
          spacing={{ base: "4", md: "8" }}
          pb={{ base: "none", md: "8" }}
          py={2}
          borderTop="1px dashed rgba(0, 0, 0, 12%)"
          borderBottom="1px dashed rgba(0, 0, 0, 12%)"
        >
          <Stack>
            <Text>Order ID: #{order.id}</Text>
            <Text>
              {(order.items || []).length}{" "}
              {(order.items || []).length === 1 ? "item" : "items"}
            </Text>
            <Text>
              Placed on {format(parseJSON(order.createdAt), "dd.MM.yyyy")}
            </Text>
            <Text>Total: ${order.totalAmount}</Text>
            <Text>Status: {order.status}</Text>

            <Link
              color="green.500"
              fontSize={{ base: "xs", md: "sm" }}
              href="/about"
            >
              Contact for refunds or complaints
            </Link>
          </Stack>

          {order.status === "UNFULFILLED" && (
            <Button
              onClick={() => cancelOrder.mutate({ orderId: order.id })}
              isLoading={cancelOrder.isLoading}
              variant="solid-outline"
            >
              Cancel Order
            </Button>
          )}
        </Stack>
      </chakra.section>

      <Heading
        as="h3"
        color="#000"
        py={{ base: "4", md: "6" }}
        fontSize={{ base: "lg", md: "1xl" }}
      >
        Items in your order
      </Heading>

      <Stack direction="column" w="100%" pb={2}>
        {itemDetailsQueryResp.isLoading && (
          <Stack align="center" justify="center" h="200px">
            <CircularProgress isIndeterminate color="black" />
          </Stack>
        )}

        {(itemDetailsQueryResp.data || []).map((itemDetail: any) => (
          <Stack
            key={itemDetail.productId}
            direction="row"
            w="100%"
            p={2}
            spacing={{ base: "2", md: "4" }}
            border="0.5px solid rgba(0, 0, 0, 12%)"
          >
            <Box>
              <Image
                boxSize="100"
                objectFit="cover"
                src={itemDetail.image}
                alt={itemDetail.name}
              />
            </Box>

            <Stack display="block" pt={{ base: "0", md: "2" }}>
              <Heading
                as="h1"
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="300"
              >
                {itemDetail.name}
              </Heading>
              <chakra.span
                display="block"
                py="0.2rem"
                fontSize={{ base: "xs", md: "sm" }}
                textTransform="uppercase"
              >
                QTY: {itemDetail.quantity}
              </chakra.span>
              <chakra.strong>${itemDetail.price}</chakra.strong>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (ctx) => {
    const orderID = ctx.params?.id as string;
    const store = ctx?.params?.store as string;

    let layoutProps = await getLayoutProps(ctx);
    if (!layoutProps) return { notFound: true };

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(orderID, 10),
        store: { name: store },
        customer: { id: ctx.req.session.data?.userId },
      },
      select: {
        id: true,
        items: true,
        createdAt: true,
        totalAmount: true,
        paymentStatus: true,
        status: true,
      },
    });
    if (!order) {
      return { notFound: true };
    }

    return {
      props: {
        order: JSON.parse(JSON.stringify(order)),
        layoutProps: {
          ...layoutProps,
          title: "Order Details",
        },
      },
    };
  }
);

Page.Layout = CustomerLayout;
export default Page;
