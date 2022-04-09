import React from "react";
import Api from "libs/api";
import type { GetServerSideProps } from "next";
import Link from "components/link";
import prisma from "libs/prisma";
import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { truncateAddress } from "libs/utils";
import { ArrowLeft, InfoCircle } from "react-iconly";
import { parseJSON, format } from "date-fns";
import { formatCurrency } from "libs/currency";
import { CostSummary } from "components/cost-summary";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { OrderPaymentStatus, OrderStatus } from "components/order-pill";
import { withSsrSession } from "libs/session";
import { useRouter } from "next/router";

function useCancelOrder() {
  const { query } = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ orderId }: any) => {
      return Api().post(`/admin/${query.store}/orders/cancel`, { orderId });
    },
    {
      onSuccess: async ({ payload: result }) => {
        await queryClient.invalidateQueries("store-dashboard-orders");

        const order = queryClient.getQueryData<any>([
          "store-order-details",
          result.id,
        ]);
        queryClient.setQueryData(["store-order-details", result.id], {
          ...order,
          status: result.status,
        });

        toast({
          title: "Order has been cancelled",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      },

      onError: (err: any) => {
        toast({
          title: "Error cancelling order",
          description: err?.message,
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      },
    }
  );
}

function useFulfillOrder() {
  const { query } = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ orderId }: any) => {
      return Api().post(`/admin/${query.store}/orders/fulfill`, { orderId });
    },
    {
      onSuccess: async ({ payload: result }) => {
        await queryClient.invalidateQueries("store-dashboard-orders");

        const order = queryClient.getQueryData<any>([
          "store-order-details",
          result.id,
        ]);
        queryClient.setQueryData(["store-order-details", result.id], {
          ...order,
          paymentStatus: result.paymentStatus,
          status: result.status,
        });

        toast({
          title: "Order has been fulfilled",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      },

      onError: (err: any) => {
        toast({
          title: "Error fulfilling order",
          description: err?.message,
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      },
    }
  );
}

const Page = (props: any) => {
  const { query } = useRouter();
  const cancelOrder = useCancelOrder();
  const fulfillOrder = useFulfillOrder();

  const { data: order } = useQuery({
    queryKey: ["store-order-details", props.order.id],
    queryFn: async () => {},
    initialData: props.order,
    staleTime: Infinity,
  });

  const costSummary = {
    subtotal: order.pricingBreakdown.subtotal,
    "Delivery fee": order.pricingBreakdown.shipping,
    "Network Fee": order.pricingBreakdown.fees,
  };

  return (
    <Container maxW="100%" px={{ base: "4", md: "16" }} mb={8}>
      <Link
        display="inline-block"
        href={`/${query.store}/orders`}
        borderBottom="none"
      >
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

      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 8, md: 20 }}
      >
        <Stack flex={2} spacing={{ base: 4, md: 10 }}>
          <Stack
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ base: "4", md: "8" }}
            >
              <Heading as="h4" fontSize={{ base: "md", md: "2xl" }}>
                Order #{order.id}
              </Heading>

              <Stack direction="row" pr={{ base: "2", md: "4" }}>
                <OrderStatus
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="1.5"
                  borderRadius="8px"
                  px="12px"
                  py="4px"
                  textAlign="center"
                  status={order.status}
                />

                <OrderPaymentStatus
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="1.5"
                  borderRadius="8px"
                  px="12px"
                  py="4px"
                  textAlign="center"
                  status={order.paymentStatus}
                />
              </Stack>
            </Stack>

            <Stack>
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {format(parseJSON(order.createdAt), "dd.MM.yyyy")} at{" "}
                {format(parseJSON(order.createdAt), "hh:mm a")}
              </Text>
            </Stack>
          </Stack>

          <Box>
            <Heading mb={4} fontSize={{ base: "md", md: "xl" }}>
              Order Items
            </Heading>

            <Stack spacing={4}>
              {order.items.map((item: any) => (
                <Stack
                  key={item.productId}
                  direction="row"
                  align="center"
                  w="100%"
                  p={2}
                  spacing={{ base: "2", md: "4" }}
                  border="0.5px solid rgba(0, 0, 0, 12%)"
                >
                  <Box>
                    <Image
                      boxSize="100"
                      display={{ base: "block", md: "none" }}
                      objectFit="cover"
                      src={item.image}
                      alt={item.name}
                    />
                    <Image
                      boxSize="100"
                      display={{ base: "none", md: "block" }}
                      objectFit="cover"
                      src={item.image}
                      alt={item.name}
                    />
                  </Box>

                  <Stack display="block" pt={{ base: "0", md: "2" }}>
                    <Heading
                      as="h1"
                      fontSize={{ base: "md", md: "xl" }}
                      fontWeight="300"
                    >
                      {item.name}
                    </Heading>
                    <chakra.span
                      display="block"
                      py="0.2rem"
                      fontSize={{ base: "xs", md: "sm" }}
                      textTransform="uppercase"
                    >
                      QTY: {item.quantity}
                    </chakra.span>
                    <chakra.strong>{formatCurrency(item.price)}</chakra.strong>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box>
            <Heading as="h4" mb={4} fontSize={{ base: "md", md: "xl" }}>
              Payment Summary
            </Heading>

            <CostSummary data={costSummary} />

            {order.status === "UNFULFILLED" && (
              <Stack>
                <Stack mt={4} direction="row" w="100%">
                  <Button
                    onClick={() => fulfillOrder.mutate({ orderId: order.id })}
                    isLoading={fulfillOrder.isLoading}
                    variant="solid"
                    width="100%"
                  >
                    Fufill Order
                  </Button>

                  <Button
                    onClick={() => cancelOrder.mutate({ orderId: order.id })}
                    isLoading={cancelOrder.isLoading}
                    w="24rem"
                    variant="solid-outline"
                  >
                    Cancel Order
                  </Button>
                </Stack>
                <Stack direction="row" align="center" py="4">
                  <InfoCircle set="bold" primaryColor="orange" />
                  <Text>Careful - Fulfill only paid orders.</Text>
                </Stack>
              </Stack>
            )}
          </Box>
        </Stack>

        <Stack flex={1}>
          <Stack
            direction="column"
            p={{ base: "4", md: "6" }}
            spacing={6}
            border="0.5px solid rgba(0, 0, 0, 12%)"
          >
            <Stack spacing={2}>
              <Heading as="h4" size="lg">
                Customer
              </Heading>
              <Stack
                direction={{ base: "column", md: "row" }}
                align={{ base: "flex-start", md: "center" }}
              >
                <Text color="#000">{order.customerDetails?.name}</Text>
                <Box
                  cursor="pointer"
                  bg="rgba(0, 0, 0, 0.04)"
                  rounded="50px"
                  height="100%"
                  px="0.8rem"
                  py="0.4rem"
                  display="inline-block"
                  userSelect="none"
                  textAlign="center"
                >
                  <Text fontSize={{ base: "sm", md: "md" }}>
                    {truncateAddress(order.customer?.address || "", 4)}
                  </Text>
                </Box>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <Heading as="h4" size="md">
                Contact info
              </Heading>
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {order.customerDetails?.email}
              </Text>
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {order.customerDetails?.phone}
              </Text>
            </Stack>

            <Stack spacing={2}>
              <Heading as="h4" size="md">
                Shipping Address
              </Heading>
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {order.customerDetails?.address}
              </Text>
            </Stack>

            <Stack spacing={2}>
              <Heading as="h4" size="md">
                Payment Method
              </Heading>
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {
                  (
                    {
                      CASH: "Cash on delivery",
                      CRYPTO: "Crypto",
                      BANK_TRANSFER: "Bank transfer",
                      CONTACT_SELLER: "Contacting you",
                    } as any
                  )[order.paymentMethod]
                }
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async ({ params, req }) => {
    if (!req.session.data) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const storeName = params?.store as string;
    if (!storeName) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const store = await prisma.store.findFirst({
      where: {
        name: storeName,
        owner: {
          id: req.session.data.userId,
        },
      },
      select: {
        name: true,
      },
    });
    if (!store) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const orderId = params?.id as string;
    if (!params?.id) {
      return {
        notFound: true,
      };
    }

    const order = await prisma.order.findFirst({
      take: 10,
      where: {
        id: parseInt(orderId),
        store: {
          name: store.name,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        customer: true,
        customerDetails: true,
        items: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        pricingBreakdown: true,
      },
    });

    if (!order) {
      return {
        notFound: true,
      };
    }

    const itemsIds: any[] = (order.items as any[])?.map(
      (i: any) => i.productId
    );
    const products = await prisma.product.findMany({
      where: {
        Store: {
          name: store.name,
        },
        id: {
          in: itemsIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: {
          take: 1,
          select: {
            url: true,
          },
        },
      },
    });

    order.items = ((order.items as any[]) || []).reduce((acc, item) => {
      const itemProduct = products.find((p) => p.id === item.productId);
      acc.push({
        ...item,
        name: itemProduct?.name,
        image: itemProduct?.images?.[0]?.url,
      });

      return acc;
    }, []);

    return {
      props: {
        order: JSON.parse(JSON.stringify(order)),
        layoutProps: {
          title: `Order #${order.id} - ${store.name} `,
        },
      },
    };
  }
);

Page.Layout = StoreDashboardLayout;
export default Page;
