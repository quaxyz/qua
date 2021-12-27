import React from "react";
import NextLink from "next/link";
import Api from "libs/api";
import prisma from "libs/prisma";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useInfiniteQuery } from "react-query";
import {
  Button,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { getStorePaths } from "libs/store-paths";

const Products = () => {
  const router = useRouter();
  const queryResp = useInfiniteQuery({
    queryKey: "store-products",
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.length > 0) {
        return lastPage[lastPage?.length - 1].id;
      }
    },
    queryFn: async ({ pageParam = 0 }) => {
      const payload: any = await Api().get(
        `/api/${router.query.store}/app/products?cursor=${pageParam}`
      );

      return payload;
    },
  });

  return (
    <StoreDashboardLayout title="Products">
      <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
        <Stack direction="row" justify="space-between" mb={10}>
          <Heading as="h2" fontSize="24px" fontWeight="500" color="#000">
            Products
          </Heading>

          <NextLink href={`/${router?.query.store}/app/products/new`} passHref>
            <Button>New Product</Button>
          </NextLink>
        </Stack>

        <Stack spacing={2}>
          {queryResp.data?.pages?.map((page, idx) => (
            <React.Fragment key={idx}>
              {page &&
                page.map((product: any, idx: any) => (
                  <chakra.div key={idx}>
                    <Text>Product Name: {product.name}</Text>
                    <Text>Product Image: {product.images[0].url}</Text>
                    <Text>Product Price: {product.price}</Text>
                  </chakra.div>
                ))}
            </React.Fragment>
          ))}

          <chakra.div>
            <Button
              onClick={() => queryResp.fetchNextPage()}
              disabled={!queryResp.hasNextPage || queryResp.isFetchingNextPage}
            >
              Load more
            </Button>
          </chakra.div>
        </Stack>

        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          mt={{ base: "8rem", md: "20rem" }}
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
      </Container>
    </StoreDashboardLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => getStorePaths();
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const store = params?.store || "";

  await queryClient.prefetchInfiniteQuery(
    "store-products",
    async () => {
      return prisma.product.findMany({
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
          images: {
            take: 1,
            select: {
              url: true,
            },
          },
        },
      });
    },
    { getNextPageParam: (lastPage: any) => lastPage.id }
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default Products;
