import React from "react";
import prisma from "libs/prisma";
import Api from "libs/api";
import NextLink from "next/link";
import Link from "components/link";
import {
  chakra,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { getLayoutProps } from "components/layouts/customer-props";
import { useInfiniteQuery } from "react-query";
import { useIntersection } from "react-use";
import { formatCurrency } from "libs/currency";
import { useGetLink } from "hooks/utils";
import { GetServerSideProps } from "next";
import { withSsrSession } from "libs/session";
import { useRouter } from "next/router";

function useQueryProducts({ initialData }: any) {
  const router = useRouter();
  const intersectionRef = React.useRef(null);

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "20px",
    threshold: 0,
  });

  const queryResp = useInfiniteQuery({
    queryKey: ["store-products", router.query?.category],
    initialData: { pages: [initialData], pageParams: [] },
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      const { payload }: any = await Api().get(
        `/products?cursor=${pageParam}&category=${router.query?.category}`
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

const Page = ({ initialData, categories }: any) => {
  const { ref, queryResp } = useQueryProducts({ initialData });

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
            href={`/?category=${category}`}
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
                  <chakra.section>
                    <Image
                      boxSize={{ base: "100%", md: "12rem", lg: "18rem" }}
                      objectFit="cover"
                      src={data.images[0].url}
                      alt={data.name}
                    />

                    <NextLink href={`/products/${data.id}`} passHref>
                      <LinkOverlay>
                        <Heading
                          as="h1"
                          fontSize="md"
                          fontWeight="normal"
                          mt={4}
                        >
                          {data.name}
                        </Heading>
                      </LinkOverlay>
                    </NextLink>

                    <Text fontSize="sm" fontWeight="700" mt={3}>
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

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (ctx) => {
    const store = ctx?.params?.store as string;
    const category = ctx?.query?.category as string;

    let layoutProps = await getLayoutProps(ctx);
    if (!layoutProps) return { notFound: true };

    const data = await prisma.product.findMany({
      take: 12,
      where: {
        category,
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

    const distinctCategories = await prisma.product.findMany({
      distinct: ["category"],
      where: {
        Store: { name: store },
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
        initialData: JSON.parse(JSON.stringify(data)),
        categories,
        layoutProps: {
          ...layoutProps,
          title: `Products`,
        },
      },
    };
  }
);

Page.Layout = CustomerLayout;
export default Page;
