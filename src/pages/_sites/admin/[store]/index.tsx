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
  Icon,
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
    <Container
      maxW="100%"
      py={{ base: "4", md: "12" }}
      px={{ base: "6", md: "16" }}
    >
      <Stack spacing={{ base: "4", md: "6" }} divider={<StackDivider />}>
        <Stack direction="row" justify="space-between" align="center">
          <Heading
            fontSize={{ base: "lg", md: "24px" }}
            fontWeight="500"
            color="#131415"
          >
            Recents
          </Heading>

          <Link
            fontSize={{ base: "sm", md: "md" }}
            href={`/${query.store}/orders`}
          >
            View all
          </Link>
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
            pt={{ base: "6rem", md: "12rem" }}
          >
            <Image
              src="/svg/Bag.svg"
              display={{ base: "none", md: "block" }}
              alt="Add Icon"
              w="20"
              h="20"
              mb="2"
            />
            <Image
              src="/svg/Bag.svg"
              display={{ base: "block", md: "none" }}
              alt="Add Icon"
              w="12"
              h="12"
              mb="1"
            />
            <Stack
              alignItems="center"
              justify="center"
              w="100%"
              spacing={{ base: "4", md: "6" }}
            >
              <Text
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="bold"
                textAlign="center"
                color="#000"
              >
                No recent orders
              </Text>

              <Link
                as={Button}
                href={`/${query.store}/products/new`}
                variant="primary"
                colorScheme="black"
                leftIcon={
                  <Icon
                    mr="0"
                    boxSize={5}
                    as={(props) => <Plus set="bold" {...props} />}
                  />
                }
              >
                Add Product
              </Link>
            </Stack>
          </Stack>
        )}
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
