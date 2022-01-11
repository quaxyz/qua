import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import prisma from "libs/prisma";
import Api from "libs/api";
import { useRouter } from "next/router";
import {
  Button,
  chakra,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { useInfiniteQuery } from "react-query";
import { useIntersection } from "react-use";
import { formatCurrency } from "libs/currency";

function useQueryProducts({ initialData }: any) {
  const router = useRouter();
  const intersectionRef = React.useRef(null);

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "20px",
    threshold: 0,
  });

  const queryResp = useInfiniteQuery({
    queryKey: ["store-products"],
    initialData: { pages: [initialData], pageParams: [] },
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      const { payload }: any = await Api().get(`/products?cursor=${pageParam}`);

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

const Page: NextPage = ({ initialData, storeDetails }: any) => {
  const router = useRouter();
  const { ref, queryResp } = useQueryProducts({ initialData });

  return (
    <CustomerLayout title="Products">
      <Container
        maxW="100%"
        px={{ base: "4", md: "16" }}
        mb={{ base: "8", md: "24" }}
      >
        <chakra.div>
          <NextLink href={`/${router?.query.store}`} passHref>
            <Link
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
          </NextLink>
        </chakra.div>

        <Grid
          gap={{ base: 4, md: 10 }}
          alignItems="center"
          templateColumns={{
            base: "100%",
            md: "repeat(4, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(6, 1fr)",
          }}
        >
          {queryResp.data?.pages.map((page, idx) => (
            <React.Fragment key={idx}>
              {page.map((data: any) => (
                <GridItem key={data.id} mb={5}>
                  <LinkBox>
                    <chakra.section>
                      <Image
                        boxSize={{ base: "350px", md: "300px" }}
                        objectFit="cover"
                        src={data.images[0].url}
                        alt={data.name}
                      />

                      <NextLink
                        href={`/${router?.query.store}/products/${data.id}`}
                        passHref
                      >
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
                        {formatCurrency(data.price, storeDetails?.currency)}
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
    </CustomerLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = params?.store as string;

  const data = await prisma.product.findMany({
    take: 12,
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

  const storeDetails = await prisma.store.findUnique({
    where: { name: store },
    select: { currency: true },
  });

  return {
    props: {
      initialData: data,
      storeDetails,
    },
  };
};

export default Page;
