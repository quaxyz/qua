import React from "react";
import NextLink from "next/link";
import Api from "libs/api";
import prisma from "libs/prisma";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useInfiniteQuery } from "react-query";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { Plus, Search } from "react-iconly";
import { FiMoreHorizontal } from "react-icons/fi";

const ProductCardMobile = (props: any) => {
  return (
    <Stack
      direction="row"
      display={{ base: "flex", md: "none" }}
      border="0.5px solid rgba(0, 0, 0, 0.12)"
      p="8px"
      mt="12px"
    >
      <Box w="100%" maxW="100px" minW="80px">
        <Image
          src={props.imageUrl ?? img}
          alt="Add Icon"
          layout="fixed"
          w={{ base: "20", md: "100" }}
          h={{ base: "20", md: "100" }}
          mb="1"
        />
      </Box>

      <Box w="100%">
        <Text fontSize="14px" fontWeight="400" lineHeight="16.94px" pb="4px">
          {props.description ??
            `WD 16TB Elements Desktop Hard Drive HDD, USB 3.0, Compatible with PC,
          Mac, PS4 & Xbox - WDBWLG0160HBK-NESN`}
        </Text>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            Price:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            {props.price ? `$${props.price}` : `$200`}
          </Text>
        </Stack>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            In stock:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            {props.inStock ?? `20`}
          </Text>
        </Stack>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            sold:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            {props.sold ?? `65`}
          </Text>
        </Stack>
      </Box>

      <Box maxW="50px">
        <IconButton aria-label="more" icon={<FiMoreHorizontal />} />
      </Box>
    </Stack>
  );
};

const ProductCardDesktop = (props: any) => {
  return (
    <Tr p="8px" mt="12px">
      <Td
        maxW="430px"
        display="flex"
        justifyContent="start"
        alignItems="center"
      >
        <Box w="100%" maxW="100px">
          <Image
            src={props.imageUrl}
            alt="Add Icon"
            layout="fixed"
            w="100%"
            h="100%"
            maxH="100px"
            maxW="100px"
            minH="60px"
            minW="60px"
            mb="1"
          />
        </Box>

        <Text pl="12px" fontWeight="300" fontSize="14px" lineHeight="16.94px">
          {props.description ??
            `WD 16TB Elements Desktop Hard Drive HDD, USB 3.0, Compatible with PC,
          Mac, PS4 & Xbox - WDBWLG0160HBK-NESN`}
        </Text>
      </Td>

      <Td textAlign="center">$ {props.price ?? `24`}</Td>
      <Td isNumeric textAlign="center">
        {props.inStock ?? `20`}
      </Td>
      <Td isNumeric textAlign="center">
        {props.sold ?? `65`}
      </Td>

      <Td textAlign="center">
        <IconButton
          aria-label="more"
          variant="outlined"
          icon={<FiMoreHorizontal />}
        />
      </Td>
    </Tr>
  );
};

const img = `https://images.unsplash.com/photo-1640195516488-1fb03e574057?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60`;

const Page = ({ initialData }: any) => {
  const router = useRouter();
  const queryResp = useInfiniteQuery({
    queryKey: "store-products",
    initialData: { pages: [initialData], pageParams: [] },
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.length > 0) {
        return lastPage[lastPage?.length - 1].id;
      }
    },
    queryFn: async ({ pageParam = 0 }) => {
      const { payload }: any = await Api().get(
        `/api/${router.query.store}/app/products?cursor=${pageParam}`
      );

      return payload;
    },
  });

  const isEmpty = !queryResp?.data?.pages.filter((p) => p.length).length;

  return (
    <StoreDashboardLayout title="Products">
      <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
        <Stack direction="row" justify="space-between" align="center" mb={10}>
          <Heading as="h2" fontSize="xl" fontWeight="600">
            Products
          </Heading>

          <NextLink href={`/${router?.query.store}/app/products/new`} passHref>
            <Button
              variant="primary"
              leftIcon={<Plus set="bold" primaryColor="#ffffff" />}
            >
              New Product
            </Button>
          </NextLink>
        </Stack>

        {!isEmpty && (
          <Box w={{ base: "full", md: "sm" }}>
            <InputGroup>
              <InputLeftElement fontSize="1rem" pointerEvents="none">
                <Icon as={(props) => <Search set="light" {...props} />} />
              </InputLeftElement>
              <Input type="text" placeholder="Search" />
            </InputGroup>
          </Box>
        )}

        {isEmpty ? (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={{ base: 40, md: 40 }}
          >
            <Image
              src="/svg/add.svg"
              alt="Add Icon"
              layout="fixed"
              w={{ base: "20", md: "100" }}
              h={{ base: "20", md: "100" }}
              mb="4"
            />

            <Stack alignItems="center" textAlign="center" justify="center">
              <Text fontSize="xl" fontWeight="bold" color="#000">
                Add and manage your products
              </Text>
              <Text fontSize="lg">
                You can add products and manage your pricing here.
              </Text>
            </Stack>
          </Stack>
        ) : (
          <Stack mt={8} spacing={5}>
            {/* heading */}
            <Grid
              display={{ base: "none", md: "grid" }}
              templateColumns="repeat(7, 1fr)"
              gap={6}
              alignItems="center"
              px={3}
            >
              <GridItem
                w="100%"
                colSpan={3}
                textTransform="uppercase"
                fontSize="sm"
                fontWeight="600"
              >
                Product Name
              </GridItem>

              <GridItem
                w="100%"
                textTransform="uppercase"
                fontSize="sm"
                fontWeight="600"
                textAlign="center"
              >
                Price
              </GridItem>

              <GridItem
                w="100%"
                textTransform="uppercase"
                fontSize="sm"
                fontWeight="600"
                textAlign="center"
              >
                In Stock
              </GridItem>

              <GridItem
                w="100%"
                textTransform="uppercase"
                fontSize="sm"
                fontWeight="600"
                textAlign="center"
              >
                Sold
              </GridItem>

              <GridItem
                w="100%"
                textTransform="uppercase"
                fontSize="sm"
                fontWeight="600"
                textAlign="center"
              >
                Actions
              </GridItem>
            </Grid>

            {queryResp.data?.pages?.map((page) =>
              page.map((data: any, idx: number) => (
                <React.Fragment key={data.id}>
                  <Stack
                    direction="row"
                    display={{ base: "flex", md: "none" }}
                    py={4}
                    px={3}
                    spacing={4}
                    border="1px solid rgb(0 0 0 / 8%)"
                  >
                    <Box>
                      <Image
                        src={data.images[0].url}
                        alt={data.name}
                        boxSize="100px"
                      />
                    </Box>

                    <Stack flex="1" spacing={2}>
                      <Text fontSize="sm">{data.name}</Text>

                      <Stack direction="row" spacing={2}>
                        <Text fontSize="sm">Price:</Text>
                        <Text fontSize="sm" fontWeight="600">
                          {data.price}
                        </Text>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Text fontSize="sm">In stock:</Text>
                        <Text fontSize="sm" fontWeight="600">
                          {data.totalStocks}
                        </Text>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Text fontSize="sm">Sold:</Text>
                        <Text fontSize="sm" fontWeight="600">
                          {data?.sold ?? 0}
                        </Text>
                      </Stack>
                    </Stack>

                    <Box>
                      <IconButton
                        aria-label="more"
                        variant="outlined"
                        size="sm"
                        fontSize="2xl"
                        icon={<FiMoreHorizontal />}
                      />
                    </Box>
                  </Stack>

                  <Grid
                    display={{ base: "none", md: "grid" }}
                    templateColumns="repeat(7, 1fr)"
                    gap={6}
                    alignItems="center"
                    py={4}
                    px={3}
                    border="1px solid rgb(0 0 0 / 8%)"
                  >
                    <GridItem w="100%" colSpan={3}>
                      <Stack direction="row" alignItems="center" spacing={4}>
                        <Image
                          src={data.images[0].url}
                          alt={data.name}
                          boxSize="50px"
                        />

                        <Text
                          textTransform="uppercase"
                          fontSize="sm"
                          fontWeight="normal"
                        >
                          {data.name}
                        </Text>
                      </Stack>
                    </GridItem>

                    <GridItem
                      w="100%"
                      textTransform="uppercase"
                      fontSize="sm"
                      fontWeight="600"
                      textAlign="center"
                    >
                      {/* TODO:: use store currency */}
                      {data.price}
                    </GridItem>

                    <GridItem
                      w="100%"
                      textTransform="uppercase"
                      fontSize="sm"
                      fontWeight="600"
                      textAlign="center"
                    >
                      {data.totalStocks}
                    </GridItem>

                    <GridItem
                      w="100%"
                      textTransform="uppercase"
                      fontSize="sm"
                      fontWeight="600"
                      textAlign="center"
                    >
                      5
                    </GridItem>

                    <GridItem w="100%" textAlign="center">
                      <IconButton
                        aria-label="more"
                        variant="outlined"
                        size="sm"
                        fontSize="2xl"
                        icon={<FiMoreHorizontal />}
                      />
                    </GridItem>
                  </Grid>
                </React.Fragment>
              ))
            )}
          </Stack>
        )}
      </Container>
    </StoreDashboardLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const stores = await prisma.store.findMany({
    select: {
      name: true,
    },
  });

  return {
    paths: stores.map((store) => ({ params: { store: store.name as string } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const store = params?.store || "";

  const data = await prisma.product.findMany({
    take: 10,
    where: {
      Store: {
        name: store as string,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      totalStocks: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  return {
    props: {
      initialData: data,
    },
  };
};

export default Page;
