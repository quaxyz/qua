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
import { ArrowLeft } from "react-iconly";
import { parseJSON, format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { domain, schemas } from "libs/constants";
import { providers } from "ethers";

function useCancelOrder() {
  const { library, account } = useWeb3React();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const cancelOrderMutation = useMutation(
    async ({ orderId }: any) => {
      if (!library || !account) {
        throw Error("Please connect your wallet");
      }

      let provider: providers.Web3Provider = library;
      const signer = provider.getSigner(account);

      // format message into schema
      const message = {
        from: account,
        timestamp: parseInt((Date.now() / 1000).toFixed()),
        store: router.query.store,
        orderId,
      };

      const data = {
        domain,
        types: { OrderCancel: schemas.OrderCancel },
        message,
      };

      const sig = await signer._signTypedData(
        data.domain,
        data.types,
        data.message
      );
      console.log("Sign", { address: account, sig, data });

      return Api().post("/orders/cancel", {
        address: account,
        sig,
        data,
      });
    },
    {
      onSuccess: ({ payload: result }) => {
        console.log("Result", result);
        queryClient.setQueryData("order-details", result);
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
    queryKey: "order-details",
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
                width="12rem"
                height="6.25rem"
                display={{ base: "block", md: "none" }}
                objectFit="cover"
                src={itemDetail.image}
                alt={itemDetail.name}
              />
              <Image
                boxSize="100"
                display={{ base: "none", md: "block" }}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const orderID = ctx.params?.id as string;
  const storeName = ctx.params?.store as string;

  const order = await prisma.order.findFirst({
    where: { id: parseInt(orderID, 10), Store: { name: storeName } },
    select: {
      id: true,
      hash: true,
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
        title: "Order Details",
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
