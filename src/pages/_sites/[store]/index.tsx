import React from "react";
import { GetStaticProps } from "next";
import prisma from "libs/prisma";
import Api from "libs/api";
import NextLink from "next/link";
import NextImage from "next/image";
import Link from "components/link";
import {
  chakra,
  Container,
  Grid,
  GridItem,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer";
import { useInfiniteQuery } from "react-query";
import { useIntersection } from "react-use";
import { formatCurrency } from "libs/currency";
import { useRouter } from "next/router";

function useQueryProducts({ initialData }: any) {
  const { query } = useRouter();
  const intersectionRef = React.useRef(null);

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "20px",
    threshold: 0,
  });

  const queryResp = useInfiniteQuery({
    queryKey: ["store-products"],
    initialData: { pages: [initialData], pageParams: [] },
    queryFn: async ({ pageParam }) => {
      const { payload }: any = await Api().get(
        `/${query.store}/products?cursor=${pageParam}`
      );
      return payload;
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.length > 0) {
        return lastPage[lastPage?.length - 1].id;
      }
    },
  });

  if (intersection && intersection.intersectionRatio > 0) {
    if (queryResp.hasNextPage && !queryResp.isFetchingNextPage)
      queryResp.fetchNextPage();
  }

  return {
    queryResp,
    ref: intersectionRef,
  };
}

const Page = ({ products, categories }: any) => {
  const { ref, queryResp } = useQueryProducts({ initialData: products });

  return (
    <Container
      maxW="100%"
      px={{ base: "4", md: "16" }}
      mb={{ base: "8", md: "24" }}
    >
      <Stack direction="row" spacing={2}>
        <Link
          href="/"
          borderBottom="none"
          _hover={{ transform: "scale(1.05)" }}
          textDecoration="underline"
        >
          <Stack
            direction="row"
            spacing={4}
            px={4}
            py={{ base: "4", md: "8" }}
            align="center"
          >
            <Text fontSize="inherit" fontWeight="600">
              All
            </Text>
          </Stack>
        </Link>

        {categories.map((category: string) => (
          <Link
            key={category}
            href={`/category/${category}`}
            borderBottom="none"
            _hover={{ transform: "scale(1.05)" }}
            textDecoration="underline"
          >
            <Stack
              direction="row"
              spacing={4}
              px={4}
              py={{ base: "4", md: "8" }}
              align="center"
            >
              <Text
                textTransform="capitalize"
                fontSize="inherit"
                fontWeight="600"
              >
                {category}
              </Text>
            </Stack>
          </Link>
        ))}
      </Stack>

      <Grid
        gap={{ base: 4, md: 10 }}
        alignItems="center"
        templateColumns={{
          base: "100%",
          md: "repeat(auto-fit, 12rem)",
          lg: "repeat(auto-fit, 18rem)",
        }}
      >
        {queryResp.data?.pages.map((page, idx) => (
          <React.Fragment key={idx}>
            {page.map((data: any) => (
              <GridItem key={data.id} mb={5}>
                <LinkBox>
                  <chakra.section title={data.name}>
                    <NextImage
                      layout="responsive"
                      width="100%"
                      height="100%"
                      priority={idx < 4} // first images will be high priority
                      objectFit="cover"
                      src={
                        data.images[0].url ??
                        `https://via.placeholder.com/373/e2e8f0?text=Image%20of%20${data.name}`
                      }
                      alt={data.name}
                    />

                    <NextLink href={`/products/${data.id}`} passHref>
                      <LinkOverlay>
                        <Heading
                          as="h1"
                          fontSize="md"
                          fontWeight="normal"
                          mt={4}
                          noOfLines={[1, 2]}
                        >
                          {data.name}
                        </Heading>
                      </LinkOverlay>
                    </NextLink>

                    <Text fontSize="sm" fontWeight="700" mt={{ md: 3 }}>
                      {formatCurrency(data.price)}
                    </Text>
                  </chakra.section>
                </LinkBox>
              </GridItem>
            ))}
          </React.Fragment>
        ))}
      </Grid>

      <div ref={ref} />
    </Container>
  );
};

export const getStaticPaths = async () => {
  const stores = await prisma.store.findMany({
    select: {
      name: true,
    },
  });

  return {
    paths: stores.map((store) => ({ params: { store: store.name as string } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.store) {
    return {
      notFound: true,
    };
  }

  const store = await prisma.store.findUnique({
    where: { name: params.store as string },
  });

  if (!store) {
    return {
      notFound: true,
    };
  }

  const data = await prisma.product.findMany({
    take: 12,
    where: {
      Store: {
        id: store.id,
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

  const distinctCategories = await prisma.product.findMany({
    distinct: ["category"],
    where: {
      Store: { id: store.id },
    },
    select: {
      category: true,
    },
  });
  const categories = (distinctCategories || [])
    .map((p) => p.category)
    .filter(Boolean);

  return {
    props: {
      products: JSON.parse(JSON.stringify(data)),
      categories,
      layoutProps: {
        title: `Products - ${store.name}`,
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
