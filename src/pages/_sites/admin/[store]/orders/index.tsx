import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import { GetServerSideProps } from "next";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
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
    <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
      <Stack direction="row" justify="space-between" align="center" mb={10}>
        <Heading
          as="h2"
          fontSize={{ base: "18px", md: "24px" }}
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
                    border="0.5px solid rgba(0, 0, 0, 0.12)"
                    p="1.4rem"
                    alignItems="center"
                  >
                    <Flex w="100%" justify="space-between">
                      <Text display={{ base: "inline-block", md: "none" }}>
                        Order ID
                      </Text>

                      <Link
                        href={`/${query.store}/orders/${data.id}`}
                        fontSize="16px"
                        fontWeight={{ base: "400", md: "600" }}
                      >
                        #{data.id}
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
                        {data.customerDetails?.name}
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
                        status={data.status}
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
                >
                  Load more
                </Button>
              </Stack>
            )}
          </Box>
        </>
      ) : (
        <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={{ base: "4rem", md: "12rem" }}
          >
            <Image
              src="/svg/Bag.svg"
              alt="Add Icon"
              layout="fixed"
              w={{ base: "16", md: "100" }}
              h={{ base: "16", md: "100" }}
              mb="1"
            />
            <Stack alignItems="center" textAlign="center" justify="center">
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                color="#000"
              >
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
        </Container>
      )}
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
        customer: true,
        customerDetails: true,
        status: true,
        paymentStatus: true,
      },
    });

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
