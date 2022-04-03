import React from "react";
import { GetStaticProps } from "next";
import { getStorePaths } from "libs/store-paths";
import Link from "components/link";
import Api from "libs/api";
import prisma from "libs/prisma";
import { useRouter } from "next/router";
import { useDebounce } from "react-use";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import {
  Box,
  Button,
  CircularProgress,
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { Plus, Search } from "react-iconly";
import { FiMoreHorizontal } from "react-icons/fi";
import { formatCurrency } from "libs/currency";

function useDeleteProduct() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    async (id: any) => {
      return Api().delete(`/dashboard/products/${id}`);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("store-dashboard-products");

        toast({
          title: "Product has been deleted",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      },

      onError: (err: any) => {
        toast({
          title: "Error deleting product",
          description: err?.message,
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      },
    }
  );
}

const ActionMenu = ({ id, ButtonProps }: any) => {
  const deleteModal = useDisclosure();
  const deleteProduct = useDeleteProduct();

  return (
    <>
      <Menu>
        <MenuButton
          variant="outlined"
          size="sm"
          fontSize="2xl"
          aria-label="product actions"
          as={IconButton}
          icon={<FiMoreHorizontal />}
          {...ButtonProps}
        />

        <MenuList>
          <Link
            as={MenuItem}
            border="none"
            href={`/products/${id}`}
            _focus={{
              transform: "none",
              boxShadow: "none !important",
              bgColor: "#ffff",
              border: "none",
              fontWeight: "600",
            }}
            _hover={{
              transform: "none",
              bgColor: "#ffff",
              border: "none",
              fontWeight: "600",
            }}
          >
            View
          </Link>

          <Link
            as={MenuItem}
            border="none"
            href={`/dashboard/products/${id}`}
            _focus={{
              transform: "none",
              boxShadow: "none !important",
              bgColor: "#ffff",
              border: "none",
              fontWeight: "600",
            }}
            _hover={{
              transform: "none",
              bgColor: "#ffff",
              border: "none",
              fontWeight: "600",
            }}
          >
            Edit
          </Link>

          <MenuItem
            onClick={() => deleteModal.onOpen()}
            color="red.500"
            _focus={{
              transform: "none",
              boxShadow: "none !important",
              bgColor: "#ffff",
              border: "none",
              fontWeight: "600",
            }}
            _hover={{
              transform: "none",
              bgColor: "#ffff",
              border: "none",
              fontWeight: "600",
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal
        isCentered
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg" color="rgb(0 0 0 / 90%)">
            Delete Product
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody color="rgb(0 0 0 / 50%)" py={5}>
            Are you sure you want to delete this product?
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="gray"
              mr={3}
              px={10}
              onClick={deleteModal.onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              colorScheme="red"
              px={10}
              onClick={() => deleteProduct.mutate(id)}
              isLoading={deleteProduct.isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Page = ({ initialData }: any) => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>(
    (router.query.search as string) || ""
  );

  useDebounce(
    () => {
      if (search.length > 0) {
        router.push(
          {
            pathname: `/_store/[store]/dashboard/products`,
            query: { store: router.query.store, search },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    1000,
    [search]
  );

  const queryResp = useInfiniteQuery({
    queryKey: ["store-dashboard-products", router.query.search],
    initialData: () => {
      if (search === "") return { pages: [initialData], pageParams: [] };
      return undefined;
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.length >= 10) {
        return lastPage[lastPage?.length - 1]?.id;
      }
    },
    queryFn: async ({ pageParam = 0 }) => {
      const { payload }: any = await Api().get(
        `/dashboard/products?cursor=${pageParam}&search=${router.query.search}`
      );

      return payload;
    },
  });

  const isEmpty = !queryResp?.data?.pages.filter((p) => p.length).length;

  return (
    <>
      <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
        <Stack direction="row" justify="space-between" align="center" mb={10}>
          <Heading
            as="h2"
            fontSize={{ base: "18px", md: "24px" }}
            fontWeight="500"
            color="#131415"
          >
            Products
          </Heading>

          <Link
            href="/dashboard/products/new"
            as={Button}
            variant="primary"
            colorScheme="black"
            leftIcon={<Plus set="bold" primaryColor="#ffffff" />}
          >
            New Product
          </Link>
        </Stack>

        {!isEmpty && (
          <Box w={{ base: "full", md: "sm" }}>
            <InputGroup>
              <InputLeftElement fontSize="1rem" pointerEvents="none">
                <Icon as={(props) => <Search set="light" {...props} />} />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Box>
        )}

        {queryResp.isLoading ? (
          <Stack alignItems="center" justifyContent="center" minH={24}>
            <CircularProgress isIndeterminate color="black" />
          </Stack>
        ) : isEmpty ? (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={{ base: "8rem", md: "16rem" }}
          >
            <Image
              src="/svg/add.svg"
              alt="Add Icon"
              layout="fixed"
              w={{ base: "16", md: "100" }}
              h={{ base: "16", md: "100" }}
              mb="4"
            />

            <Stack alignItems="center" textAlign="center" justify="center">
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                color="#000"
              >
                No Products
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }}>
                Add products and manage pricing here.
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
                        objectFit="cover"
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
                          {data.totalStocks ?? "unlimited"}
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
                      <ActionMenu id={data?.id} />
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
                          boxSize="60px"
                          objectFit="cover"
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
                      {data.totalStocks ?? "unlimited"}
                    </GridItem>

                    <GridItem
                      w="100%"
                      textTransform="uppercase"
                      fontSize="sm"
                      fontWeight="600"
                      textAlign="center"
                    >
                      {data?.totalSold || 0}
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
    </>
  );
};

export const getStaticPaths = getStorePaths;
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const store = (params?.store as string) || "";

  const data = await prisma.product.findMany({
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
      name: true,
      price: true,
      totalStocks: true,
      totalSold: true,
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
      layoutProps: {
        title: "Products",
      },
      revalidate: 5 * 60 * 60,
    },
    revalidate: 5 * 60 * 60,
  };
};

Page.Layout = StoreDashboardLayout;
export default Page;
