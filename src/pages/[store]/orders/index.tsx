import React from "react";
import Link from "components/link";
import Api from "libs/api";
import prisma from "libs/prisma";
import { GetServerSideProps } from "next";
import {
  chakra,
  Container,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { getAddressFromCookie } from "libs/cookie";
import { OrderStatus } from "components/order-pill";
import { useIntersection } from "react-use";
import { useInfiniteQuery } from "react-query";

function useQueryOrders({ initialData }: any) {
  const intersectionRef = React.useRef(null);

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "20px",
    threshold: 0,
  });

  const queryResp = useInfiniteQuery({
    queryKey: ["store-orders"],
    initialData: { pages: [initialData], pageParams: [] },
    staleTime: Infinity,
    queryFn: async ({ pageParam }) => {
      const { payload }: any = await Api().get(`/orders?cursor=${pageParam}`);

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

const Page = ({ orders }: any) => {
  const { ref, queryResp } = useQueryOrders({ initialData: orders });

  return (
    <Container
      maxW={{ base: "100%", md: "container.xl" }}
      px={{ base: "4", md: "16" }}
    >
      <Heading
        as="h3"
        color="#000"
        py={{ base: "4", md: "8" }}
        mt={{ base: "0", md: "8" }}
        fontSize={{ base: "lg", md: "2xl" }}
      >
        Orders
      </Heading>

      <Stack direction="column" w="100%" pb={2}>
        {queryResp.data?.pages.map((page, idx) => (
          <React.Fragment key={idx}>
            {page.map((order: any) => (
              <Stack
                key={order.id}
                direction="row"
                w="100%"
                p={{ base: "2", md: "0.75rem" }}
                pr={{ base: "0", md: "2.8rem" }}
                spacing={{ base: "2", md: "4" }}
                border="0.5px solid rgba(0, 0, 0, 16%)"
              >
                <Image
                  boxSize={{ base: "6.25rem", md: "150px" }}
                  objectFit="cover"
                  src={order.product.image}
                  alt={order.product.name}
                />

                <Stack
                  display="block"
                  w={{ base: "none", md: "100%" }}
                  pt={{ base: "0", md: "2" }}
                >
                  <Heading
                    as="h1"
                    fontSize={{ base: "md", md: "xl" }}
                    fontWeight="300"
                  >
                    {order.product.name}
                  </Heading>
                  <Text fontSize="0.938rem">OrderID: #{order.id}</Text>

                  <OrderStatus
                    as="span"
                    display="inline-block"
                    px="0.4rem"
                    py="0.2rem"
                    borderRadius={4}
                    fontSize="xs"
                    textTransform="uppercase"
                    status={order.status}
                  />

                  <Link
                    href={`/orders/${order.id}`}
                    float={{ base: "none", md: "right" }}
                    position="relative"
                  >
                    <chakra.span
                      mt="1rem"
                      textTransform="uppercase"
                      display="inline-block"
                    >
                      See details
                    </chakra.span>
                  </Link>
                </Stack>
              </Stack>
            ))}
          </React.Fragment>
        ))}
      </Stack>

      <div ref={ref} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const storeName = ctx.params?.store as string;
  const address = getAddressFromCookie(true, ctx);

  const store = await prisma.store.findUnique({
    where: { name: storeName },
    select: { id: true },
  });

  if (!store) {
    return { notFound: true };
  }

  const orders = await prisma.order.findMany({
    take: 10,
    where: { customerAddress: address || "", storeId: store?.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, status: true, paymentStatus: true, items: true },
  });

  const itemsIds: any[] = orders
    .map((o: any) => (o.items[0] || {}).productId)
    .filter(Boolean);

  const products = await prisma.product.findMany({
    where: {
      Store: {
        id: store.id,
      },
      id: {
        in: itemsIds,
      },
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

  const formatedOrders = [];
  for (let order of orders) {
    const product = products.find(
      (p) => p.id === ((order.items as any)[0] || {}).productId
    );
    if (!product) continue;

    formatedOrders.push({
      id: order?.id,
      status: order?.status,
      paymentStatus: order?.paymentStatus,
      product: {
        id: product?.id,
        name: product?.name,
        image: product?.images[0]?.url,
      },
    });
  }

  return {
    props: {
      orders: formatedOrders,
      layoutProps: {
        title: "Orders",
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
