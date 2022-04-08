import React from "react";
import prisma from "libs/prisma";
import Link from "components/link";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { Plus } from "react-iconly";
import { OrderPaymentStatus, OrderStatus } from "components/order-pill";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { withSsrSession } from "libs/session";

const Page = ({ orders = [] }: any) => {
  const { query } = useRouter();
  const ordersIsEmpty = !orders.length;

  return (
    <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
      <Stack spacing={10} divider={<StackDivider />}>
        <Stack>
          <Stack direction="row" justify="space-between" align="center" mb={10}>
            <Heading
              as="h2"
              fontSize={{ base: "18px", md: "24px" }}
              fontWeight="500"
              color="#131415"
            >
              Activity
            </Heading>

            <Link href={`/${query.store}/orders`}>View all orders</Link>
          </Stack>

          {!ordersIsEmpty ? (
            <Box>
              <Stack
                direction="row"
                display={{ base: "none", md: "flex" }}
                my="8px"
                px="1rem"
                py="1rem"
              >
                <Flex w="100%">
                  <Text>Order ID</Text>
                </Flex>
                <Flex w="100%">
                  <Text>Customer</Text>
                </Flex>
                <Flex w="100%">
                  <Text>Status</Text>
                </Flex>
                <Flex w="100%">
                  <Text>Payment</Text>
                </Flex>
              </Stack>

              {orders.map((order: any) => (
                <React.Fragment key={order.id}>
                  <Stack
                    mb="1rem"
                    direction={{ base: "column", md: "row" }}
                    border="0.5px solid rgba(0, 0, 0, 0.12)"
                    p="1.4rem"
                    alignItems="center"
                  >
                    <Flex w="100%" justify="space-between">
                      <Text display={{ base: "inline-block", md: "none" }}>
                        Order ID
                      </Text>

                      <Link
                        href={`/${query.store}/orders/${order.id}`}
                        fontSize="16px"
                        fontWeight={{ base: "400", md: "600" }}
                      >
                        #{order.id}
                      </Link>
                    </Flex>
                    <Flex w="100%" justify="space-between">
                      <Text display={{ base: "inline-block", md: "none" }}>
                        Customer
                      </Text>
                      <Text
                        fontSize="14px"
                        textAlign="right"
                        fontWeight={{ base: "600", md: "600" }}
                        mb={{ base: "2", md: "0" }}
                      >
                        {order.customerDetails?.name}{" "}
                      </Text>
                    </Flex>
                    <Flex w="100%" justify="space-between">
                      <Text display={{ base: "inline-block", md: "none" }}>
                        Status
                      </Text>
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
                    </Flex>
                    <Flex w="100%" justify="space-between">
                      <Text display={{ base: "inline-block", md: "none" }}>
                        Payment
                      </Text>
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
                    </Flex>
                  </Stack>
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              py={{ base: "4rem", md: "6rem" }}
            >
              <Image
                src="/svg/Bag.svg"
                alt="Add Icon"
                layout="fixed"
                w={{ base: "20", md: "100" }}
                h={{ base: "20", md: "100" }}
                mb="1"
              />
              <Stack alignItems="center" textAlign="center" justify="center">
                <Text fontSize="xl" fontWeight="bold" color="#000">
                  No recent orders
                </Text>

                <Link
                  as={Button}
                  href={`/${query.store}/products/new`}
                  variant="primary"
                  colorScheme="black"
                >
                  <Plus
                    set="bold"
                    primaryColor="#ffffff"
                    style={{ marginRight: "14px" }}
                  />
                  Add Product
                </Link>
              </Stack>
            </Stack>
          )}
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

    const data = await prisma.order.findMany({
      take: 5,
      where: {
        store: {
          name: store.name,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        customerDetails: true,
        status: true,
        paymentStatus: true,
      },
    });

    return {
      props: {
        orders: data,
        layoutProps: {
          title: `Dashboard - ${store.name}`,
        },
      },
    };
  }
);

Page.Layout = StoreDashboardLayout;
export default Page;
