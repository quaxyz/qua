import React from "react";
import { GetServerSideProps } from "next";
import Link from "components/link";
import Api from "libs/api";
import prisma from "libs/prisma";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { useRouter } from "next/router";
import { useInfiniteQuery } from "react-query";
import { Plus, Search } from "react-iconly";
import { truncateAddress } from "libs/utils";

const statusColor: any = {
  cancelled: {
    bgColor: "red.200",
    color: "red.800",
  },
  unfulfilled: {
    bgColor: "rgba(254, 238, 205, 1)",
    color: "rgba(120, 81, 2, 1)",
  },
  fulfilled: {
    bgColor: "rgba(205, 254, 240, 1)",
    color: "rgba(2, 120, 87, 1)",
  },
};

const paymentStatusColor: any = {
  paid: {
    bgColor: "rgba(205, 254, 240, 1)",
    color: "rgba(2, 120, 87, 1)",
  },
  contact_seller: {
    bgColor: "rgba(254, 238, 205, 1)",
    color: "rgba(120, 81, 2, 1)",
  },
  unpaid: {
    bgColor: "rgba(254, 238, 205, 1)",
    color: "rgba(120, 81, 2, 1)",
  },
};

const Page = ({ initialData }: any) => {
  const router = useRouter();

  const queryResp = useInfiniteQuery({
    queryKey: "store-dashboard-orders",
    initialData: { pages: [initialData], pageParams: [] },
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.length >= 10) {
        return lastPage[lastPage?.length - 1].id;
      }
    },
    queryFn: async ({ pageParam = 0 }) => {
      const { payload }: any = await Api().get(
        `/app/orders?cursor=${pageParam}`
      );

      return payload;
    },
  });
  const isEmpty = !queryResp?.data?.pages.filter((p) => p.length).length;

  return (
    <Box px={{ base: "1rem", md: "4rem" }}>
      <Flex justifyContent="space-between" py="2rem" alignItems="center">
        <Heading
          as="h2"
          fontSize={{ base: "18px", md: "24px" }}
          fontWeight="500"
          color="#000"
        >
          All orders
        </Heading>
      </Flex>

      {!isEmpty ? (
        <>
          {/* <Box maxW="403px" pt="5px" pb={{ base: "28px", md: "45px" }}>
            <InputGroup>
              <InputLeftElement fontSize="1rem" pointerEvents="none">
                <Icon
                  boxSize="10px"
                  as={() => <Search set="light" primaryColor="#0E0F0F" />}
                />
              </InputLeftElement>
              <Input
                type="text"
                color="rgba(180, 182, 184, 1)"
                placeholder="Search"
              />
            </InputGroup>
          </Box> */}

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
                        href={`/app/orders/orderId`}
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
                        {data.customerDetails?.name}{" "}
                        {truncateAddress(data.customerAddress, 4)}
                      </Text>
                    </Flex>
                    <Flex w="100%" justify="space-between">
                      <Text display={{ base: "inline-block", md: "none" }}>
                        Status
                      </Text>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        lineHeight="1.5"
                        borderRadius="8px"
                        px="12px"
                        py="4px"
                        textAlign="center"
                        textTransform="capitalize"
                        {...statusColor[data.status.toLowerCase()]}
                      >
                        {data.status.toLowerCase()}
                      </Text>
                    </Flex>
                    <Flex w="100%" justify="space-between">
                      <Text display={{ base: "inline-block", md: "none" }}>
                        Payment
                      </Text>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        lineHeight="1.5"
                        borderRadius="8px"
                        px="12px"
                        py="4px"
                        textAlign="center"
                        textTransform="capitalize"
                        {...paymentStatusColor[
                          data.paymentStatus.toLowerCase()
                        ]}
                      >
                        {data.paymentStatus.toLowerCase()}
                      </Text>
                    </Flex>
                  </Stack>
                </React.Fragment>
              ))
            )}
          </Box>
        </>
      ) : (
        <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={{ base: "8rem", md: "14rem" }}
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
              <Text fontSize="lg" pb="14px">
                Add a product to your store to recieve orders
              </Text>

              <Link
                as={Button}
                href={`/${router?.query.store}/app/products/new`}
                variant="primary"
              >
                <Plus
                  set="bold"
                  primaryColor="#ffffff"
                  style={{ marginRight: "14px" }}
                />
                New Product
              </Link>
            </Stack>
          </Stack>
        </Container>
      )}
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = (params?.store as string) || "";

  const data = await prisma.order.findMany({
    take: 10,
    where: {
      Store: {
        name: store,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      customerAddress: true,
      customerDetails: true,
      status: true,
      paymentStatus: true,
    },
  });

  return {
    props: {
      initialData: data,
      layoutProps: {
        title: "Orders",
      },
    },
  };
};

Page.Layout = StoreDashboardLayout;
export default Page;
