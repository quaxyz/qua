import React from "react";
import type { GetStaticProps } from "next";
import prisma from "libs/prisma";
import Api from "libs/api";
import CustomerLayout from "components/layouts/customer";
import {
  Button,
  chakra,
  CircularProgress,
  Container,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CostSummary } from "components/cost-summary";
import { Quantity } from "components/quantity";
import { useCartStore } from "hooks/useCart";
import { Delete } from "react-iconly";
import { useMutation, useQueries } from "react-query";
import { useDebounce } from "react-use";
import { useRouter } from "next/router";
import { formatCurrency } from "libs/currency";

const CartItem = ({ item }: any) => {
  const cart = useCartStore();
  const [quantity, setQuantity] = React.useState(item.quantity);

  useDebounce(
    () => {
      if (quantity !== item.quantity) {
        cart?.updateCartItem(item.productId, quantity);
      }
    },
    1000,
    [quantity]
  );

  // TODO:: disable item when available stocks is 0
  return (
    <>
      <Stack
        direction="row"
        display={{ base: "none", md: "flex" }}
        borderBottom="0.5px solid rgba(0, 0, 0, 6%)"
        p="4"
        alignItems="center"
        justify="space-between"
        maxWidth="100%"
      >
        <Stack direction="row" w="100%" spacing={6}>
          <Stack direction="row" w="25rem" align="center">
            <IconButton
              onClick={() => cart?.removeCartItem(item.productId)}
              variant="flushed"
              aria-label="Delete"
              icon={<Delete set="light" />}
            />

            <Image
              boxSize="80px"
              objectFit="cover"
              src={item.image}
              alt="Product Image"
            />
            <Heading
              as="h1"
              size="sm"
              pt={4}
              fontWeight="300"
              isTruncated
              title={item.name}
            >
              {item.name}
            </Heading>
          </Stack>
        </Stack>

        <Stack w="100%" align="center">
          <Text fontSize="14px">
            <chakra.strong>{formatCurrency(item.price)}</chakra.strong>
          </Text>
        </Stack>

        <Stack w="100%" align="center">
          <Quantity
            quantity={quantity}
            setQuantity={(v) => setQuantity(v)}
            max={item.availableStocks || Infinity}
            min={1}
          />
        </Stack>

        <Stack w="100%" align="center">
          <Text fontSize="14px">
            <chakra.strong>{formatCurrency(item.subtotal)}</chakra.strong>
          </Text>
        </Stack>
      </Stack>

      {/* Mobile display */}
      <Stack
        display={{ base: "flex", md: "none" }}
        direction="column"
        w="100%"
        pb={2}
      >
        <Stack
          direction="row"
          w="100%"
          p={2}
          spacing={4}
          border="0.5px solid rgba(0, 0, 0, 16%)"
        >
          <Image
            boxSize="80px"
            objectFit="cover"
            src={item.image}
            alt="Product Image"
          />

          <Stack w="100%">
            <Stack
              direction="row"
              align="center"
              justify="space-between"
              w="100%"
              spacing={4}
            >
              <Heading as="h1" size="md" fontWeight="300">
                {item.name}
              </Heading>
              <IconButton
                onClick={() => cart?.removeCartItem(item.productId)}
                variant="flushed"
                aria-label="Delete"
                icon={<Delete set="light" />}
              />
            </Stack>
            <Text fontSize="0.938rem">
              <chakra.strong>{`$${item.price || 0}.00`}</chakra.strong>
            </Text>

            <Stack>
              <Stack direction="row" align="center" w="100%" spacing={2}>
                <Text fontSize="0.938rem">Subtotal:</Text>
                <Text fontSize="0.938rem">
                  <chakra.strong>{`$${
                    item.price * quantity || 0
                  }.00`}</chakra.strong>
                </Text>
              </Stack>

              <Stack direction="row" align="center" w="100%" spacing={2}>
                <Text>Qty:</Text>
                <Stack w="100%" align="center">
                  <Quantity
                    quantity={quantity}
                    setQuantity={(v) => setQuantity(v)}
                    max={item.availableStocks || Infinity}
                    min={1}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

const Page = () => {
  const { query } = useRouter();
  const cartStore = useCartStore();
  const toast = useToast();

  const items = cartStore?.items;

  const checkoutMutation = useMutation(
    async (payload: any) => {
      if (payload.length === 0) throw new Error("No items in cart");

      // check if there's existing unfinished order
      const order = localStorage.getItem("unfinishedOrder");

      return Api().post(`/${query.store}/checkout`, {
        ...payload,
        orderId: order || null,
      });
    },
    {
      onError: (e: any) => {
        console.error("Error proceeding to checkout", e);

        toast({
          title: "Error proceeding to checkout",
          description: e.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  const cartProductsQuery = useQueries(
    (items || []).map((item) => ({
      queryKey: ["product", item.productId],
      queryFn: async () => {
        const { payload } = await Api().get(
          `/${query.store}/products/${item.productId}`
        );
        return payload;
      },
      onError: (e: any) => {
        toast({
          title: "Error fetching product",
          description: e.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }))
  );
  const cartProductsLoading = cartProductsQuery.every(
    (query) => query.isLoading && !query.data
  );
  const cartProducts = React.useMemo(() => {
    return cartProductsQuery
      .map((query) => {
        if (!query.data) return undefined;

        const product = query.data;
        const cartItem = (items || []).find(
          (item) => item.productId === product.id
        );

        if (!cartItem) return undefined;
        return {
          productId: product.id,
          quantity: cartItem.quantity,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          subtotal: product.price * cartItem.quantity,
          outOfStock: !!product.availableStocks,
        };
      })
      .filter(Boolean);
  }, [cartProductsQuery, items]);

  const subtotal = React.useMemo(() => {
    return cartProducts.reduce((total, product) => {
      if (!product) return total;
      if (product.outOfStock) return total;

      return total + product.subtotal;
    }, 0);
  }, [cartProducts]);

  const costSummary = { subtotal };

  return (
    <Container maxW="100%" px={{ base: "2", md: "24" }}>
      <Stack direction={{ base: "column", md: "row" }} spacing={6}>
        <chakra.div flex={3}>
          <Stack w="100%" align="center" p={{ base: "4", md: "8" }}>
            <Heading fontSize={{ base: "xl", md: "3xl" }} fontWeight="300">
              Your Cart ({cartStore?.items.length || 0} item)
            </Heading>
          </Stack>

          <Stack>
            <Stack
              direction="row"
              display={{ base: "none", md: "flex" }}
              mb="2"
              p="2rem"
              borderBottom="0.5px solid rgba(0, 0, 0, 8%)"
            >
              <Stack w="100%">
                <Text pl="9">Product</Text>
              </Stack>
              <Stack w="100%" align="center">
                <Text>Price</Text>
              </Stack>
              <Stack w="100%" align="center">
                <Text>Qty</Text>
              </Stack>
              <Stack w="100%" align="center">
                <Text>Subtotal</Text>
              </Stack>
            </Stack>

            {cartProductsLoading && (
              <Stack align="center" justify="center" h="200px">
                <CircularProgress isIndeterminate color="black" />
              </Stack>
            )}

            {!cartProducts.length && !cartProductsLoading && (
              <Stack align="center" justify="center">
                <Text>Your cart is empty</Text>
              </Stack>
            )}

            {cartProducts.map((item: any) => (
              <CartItem item={item} key={item.productId} />
            ))}
          </Stack>
        </chakra.div>

        <chakra.div flex={1} pt={{ md: 16 }}>
          <Stack
            width={{ base: "100%", md: "24.813rem" }}
            p={4}
            my={4}
            position="relative"
            border="0.5px solid rgba(0, 0, 0, 12%)"
          >
            <CostSummary data={costSummary} />
            <Text fontSize="sm">Shipping will be calculated at next step</Text>

            <Button
              size="lg"
              variant="solid"
              width="100%"
              isDisabled={!items?.length}
              onClick={() => checkoutMutation.mutate({ items })}
              isLoading={checkoutMutation.isLoading}
            >
              Proceed to checkout
            </Button>
          </Stack>
        </chakra.div>
      </Stack>
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

  return {
    props: {
      layoutProps: {
        title: `Cart - ${store.name}`,
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
