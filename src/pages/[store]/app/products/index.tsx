import React from "react";
import NextLink from "next/link";
import Api from "libs/api";
import prisma from "libs/prisma";
import { GetServerSideProps } from "next";
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
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { Plus, Search } from "react-iconly";
import { FiMoreHorizontal } from "react-icons/fi";
import { formatCurrency } from "libs/currency";

const ActionMenu = ({ id }: any) => {
  const router = useRouter();

  return (
    <Menu>
      <MenuButton
        variant="outlined"
        size="sm"
        fontSize="2xl"
        aria-label="product actions"
        as={IconButton}
        icon={<FiMoreHorizontal />}
      />

      <MenuList>
        <NextLink href={`/${router?.query.store}/products/${id}`} passHref>
          <MenuItem
            as={Link}
            border="none"
            _hover={{ transform: "none", boxShadow: "none" }}
          >
            View
          </MenuItem>
        </NextLink>

        <NextLink href={`/${router?.query.store}/app/products/${id}`} passHref>
          <MenuItem
            as={Link}
            border="none"
            _hover={{ transform: "none", boxShadow: "none" }}
          >
            Edit
          </MenuItem>
        </NextLink>

        <MenuItem fontWeight="600" color="red.500">
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const Page = ({ initialData }: any) => {
  const router = useRouter();
  const queryResp = useInfiniteQuery({
    queryKey: "store-dashboard-products",
    initialData: { pages: [initialData], pageParams: [] },
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.length >= 10) {
        return lastPage[lastPage?.length - 1].id;
      }
    },
    queryFn: async ({ pageParam = 0 }) => {
      const { payload }: any = await Api().get(
        `/app/products?cursor=${pageParam}`
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
              page.map((data: any) => (
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
                          {formatCurrency(data.price)}
                        </Text>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Text fontSize="sm">In stock:</Text>
                        <Text fontSize="sm" fontWeight="600">
                          {data.totalStocks || 0}
                        </Text>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Text fontSize="sm">Sold:</Text>
                        <Text fontSize="sm" fontWeight="600">
                          {data?.sold || 0}
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
                      {formatCurrency(data.price)}
                    </GridItem>

                    <GridItem
                      w="100%"
                      textTransform="uppercase"
                      fontSize="sm"
                      fontWeight="600"
                      textAlign="center"
                    >
                      {data.totalStocks || 0}
                    </GridItem>

                    <GridItem
                      w="100%"
                      textTransform="uppercase"
                      fontSize="sm"
                      fontWeight="600"
                      textAlign="center"
                    >
                      {data?.sold || 0}
                    </GridItem>

                    <GridItem w="100%" textAlign="center">
                      <ActionMenu id={data?.id} />
                    </GridItem>
                  </Grid>
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
          </Stack>
        )}
      </Container>
    </StoreDashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = (params?.store as string) || "";

  const data = await prisma.product.findMany({
    take: 10,
    where: {
      Store: {
        name: store,
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
