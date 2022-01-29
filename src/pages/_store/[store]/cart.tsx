import React from "react";
import type { GetServerSideProps } from "next";
import Api from "libs/api";
import CustomerLayout from "components/layouts/customer-dashboard";
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
import { useWeb3React } from "@web3-react/core";
import { CostSummary } from "components/cost-summary";
import { Quantity } from "components/quantity";
import { Wallet } from "components/wallet";
import { useCartStore } from "hooks/useCart";
import { Delete } from "react-iconly";
import { useMutation, useQuery } from "react-query";
import { useDebounce } from "react-use";
import { getLayoutProps } from "components/layouts/props";

const CartItem = ({ item }: any) => {
  const cartStore = useCartStore();
  const [quantity, setQuantity] = React.useState(item.quantity);

  const [, cancel] = useDebounce(
    () => {
      if (quantity !== item.quantity) {
        cartStore?.updateCartItem(item.productId, quantity, item.price);
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
        <Stack direction="row" w="100%" spacing={4}>
          <Stack direction="row" align="center">
            <IconButton
              onClick={() =>
                cartStore?.removeCartItem(item.productId, item.price)
              }
              variant="flushed"
              aria-label="Delete"
              icon={<Delete set="light" />}
            />
            <Image
              width="100px"
              height="100px"
              objectFit="cover"
              src={item.image}
              alt="Product Image"
            />
          </Stack>
          <Heading as="h1" size="sm" pt={4} fontWeight="300">
            {item.name}
          </Heading>
        </Stack>

        <Stack w="100%" align="center">
          <Text fontSize="14px">
            <chakra.strong>{`$${item.price || 0}.00`}</chakra.strong>
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
            <chakra.strong>{`$${item.price * quantity || 0}.00`}</chakra.strong>
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
            width="100px"
            height="100px"
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
                onClick={() =>
                  cartStore?.removeCartItem(item.productId, item.price)
                }
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
  const { account } = useWeb3React();
  const cartStore = useCartStore();
  const toast = useToast();

  const items = cartStore?.items.map((c) => c.productId);
  const cartDetailsQueryResp = useQuery({
    queryKey: ["productItemDetails", items],
    onError: () => console.warn("Error fetching cart details from API"),
    enabled: (items?.length || 0) > 0,
    queryFn: async () => {
      const { payload } = await Api().post(`/products/details`, { items });
      return payload;
    },
    select: (data) =>
      data.map((product: any) => {
        const cartItem = cartStore?.items.find(
          (item) => product.id === item.productId
        );

        return {
          productId: product.id,
          quantity: cartItem?.quantity,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          // todo: substract total sold
          availableStocks: product.totalStocks,
        };
      }),
  });

  const checkoutMutation = useMutation(
    () => {
      if (!account) throw new Error("No connected account");
      if (cartStore?.items.length === 0) throw new Error("No items in cart");

      return Api().get(`/checkout?address=${account}`);
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

  const costSummary = {
    subtotal: cartStore?.subTotal || 0,
  };

  return (
    <Container maxW="100%" px={{ base: "2", md: "24" }}>
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

        {cartDetailsQueryResp.isLoading && (
          <Stack align="center" justify="center" h="200px">
            <CircularProgress isIndeterminate color="black" />
          </Stack>
        )}

        {!cartDetailsQueryResp.isLoading && !cartDetailsQueryResp.data?.length && (
          <Stack align="center" justify="center">
            <Text>Your cart is empty</Text>
          </Stack>
        )}

        {cartDetailsQueryResp.data?.map((item: any) => (
          <CartItem item={item} key={item.productId} />
        ))}
      </Stack>

      <Stack
        width={{ base: "100%", md: "24.813rem" }}
        p={4}
        my={4}
        float="right"
        position="relative"
        border="0.5px solid rgba(0, 0, 0, 12%)"
      >
        <CostSummary data={costSummary} />
        <Text fontSize="sm">Shipping will be calculated at next step</Text>

        {!account ? (
          <Wallet ButtonProps={{ variant: "solid", size: "lg", w: "100%" }} />
        ) : (
          <Button
            size="lg"
            variant="solid"
            width="100%"
            onClick={() => checkoutMutation.mutate()}
            isLoading={checkoutMutation.isLoading}
          >
            Proceed to checkout
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let layoutProps = await getLayoutProps(ctx);
  if (!layoutProps) return { notFound: true };

  return {
    props: {
      layoutProps: {
        ...layoutProps,
        title: "Cart",
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
