import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
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
import StoreDashboardLayout from "components/layouts/store-dashboard";
import Link from "components/link";
import { Plus } from "react-iconly";
import { OrderPaymentStatus, OrderStatus } from "components/order-pill";
import { useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";
import { withSsrSession } from "libs/session";

const Page = ({ orders }: any) => {
  const { query } = useRouter();

  const queryResp = useInfiniteQuery({
    queryKey: ["store-dashboard-orders", query.store],
    initialData: { pages: [orders], pageParams: [] },
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.length >= 0) {
        return lastPage[lastPage?.length - 1]?.id;
      }
    },
    queryFn: async ({ pageParam = 0 }) => {
      const { payload }: any = await Api().get(
        `/admin/${query.store}/orders?cursor=${pageParam}`
      );
      return payload;
    },
  });
  const isEmpty = !queryResp?.data?.pages.filter((p) => p.length).length;

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
            All orders
          </Heading>
        </Stack>

        {!isEmpty ? (
          <>
            <Box pb="3rem">
              <Stack
                direction="row"
                display={{ base: "none", md: "flex" }}
                my="8px"
                px="1.5rem"
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

              {queryResp.data?.pages?.map((page) =>
                page.map((data: any) => (
                  <React.Fragment key={data.id}>
                    <Stack
                      mb="1rem"
                      direction={{ base: "column", md: "row" }}
                      border="1px solid rgb(0 0 0 / 8%)"
                      p="1.4rem"
                      alignItems="center"
                    >
                      <Flex w="100%" justify="space-between">
                        <Text
                          fontSize="sm"
                          display={{ base: "inline-block", md: "none" }}
                        >
                          Order ID
                        </Text>

                        <Link
                          href={`/${query.store}/orders/${data.id}`}
                          fontSize="md"
                          fontWeight={{ base: "400", md: "600" }}
                        >
                          #{data.id}
                        </Link>
                      </Flex>
                      <Flex w="100%" justify="space-between">
                        <Text
                          fontSize="sm"
                          display={{ base: "inline-block", md: "none" }}
                        >
                          Customer
                        </Text>
                        <Text
                          fontSize="sm"
                          textAlign="right"
                          fontWeight={{ base: "600", md: "600" }}
                          mb={{ base: "2", md: "0" }}
                        >
                          {data.customerDetails?.name}
                        </Text>
                      </Flex>
                      <Flex w="100%" justify="space-between">
                        <Text
                          fontSize="sm"
                          display={{ base: "inline-block", md: "none" }}
                        >
                          Status
                        </Text>
                        <OrderStatus
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="500"
                          lineHeight="1.5"
                          rounded="8px"
                          px="12px"
                          py="4px"
                          textAlign="center"
                          status={data.status}
                        />
                      </Flex>
                      <Flex w="100%" justify="space-between">
                        <Text
                          fontSize="sm"
                          display={{ base: "inline-block", md: "none" }}
                        >
                          Payment
                        </Text>
                        <OrderPaymentStatus
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="500"
                          lineHeight="1.5"
                          rounded="8px"
                          px="12px"
                          py="4px"
                          textAlign="center"
                          status={data.paymentStatus}
                        />
                      </Flex>
                    </Stack>
                  </React.Fragment>
                ))
              )}

              {queryResp.hasNextPage && (
                <Stack align="center">
                  <Button
                    onClick={() => queryResp.fetchNextPage()}
                    isLoading={queryResp.isFetchingNextPage}
                    variant="solid-outline"
                    size="sm"
                  >
                    Load more
                  </Button>
                </Stack>
              )}
            </Box>
          </>
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

    const data = (
      await prisma.order.findMany({
        take: 10,
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
      })
    ).filter((order) => Object.keys(order.customerDetails || {}).length);

    return {
      props: {
        orders: JSON.parse(JSON.stringify(data)),
        layoutProps: {
          title: `Orders - ${store.name}`,
        },
      },
    };
  }
);

Page.Layout = StoreDashboardLayout;
export default Page;
