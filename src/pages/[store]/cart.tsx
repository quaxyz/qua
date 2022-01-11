import React from "react";
import NextLink from "next/link";
import Api from "libs/api";
import type { NextPage } from "next";
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
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { CostSummary } from "components/cost-summary";
import { useCartStore } from "hooks/useCart";
import { useRouter } from "next/router";
import { Delete } from "react-iconly";
import { useWeb3React } from "@web3-react/core";
import { useQuery } from "react-query";
import { Quantity } from "components/quantity";
import { useDebounce } from "react-use";

const CartItem = ({ item }: any) => {
  const cartStore = useCartStore();
  const [quantity, setQuantity] = React.useState(item.quantity);

  const [, cancel] = useDebounce(
    () => {
      if (quantity !== item.quantity) {
        cartStore?.updateCartItem(item.productId, quantity);
      }
    },
    1000,
    [quantity]
  );

  // TODO:: disable item when available stocks is 0
  return (
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
            onClick={() => cartStore?.removeCartItem(item.productId)}
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
          <chakra.strong>{`$${item.price ?? 0}.00`}</chakra.strong>
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
          <chakra.strong>{`$${item.price * quantity ?? 0}.00`}</chakra.strong>
        </Text>
      </Stack>
    </Stack>
  );
};

const CartLayout = () => {
  const { account } = useWeb3React();
  const router = useRouter();
  const cartStore = useCartStore();

  const items = cartStore?.items.map((c) => c.productId);
  const queryResp = useQuery({
    queryKey: ["cartItemsDetails", items],
    onError: () => console.warn("Error fetching cart details from API"),
    queryFn: async () => {
      const { payload } = await Api().post(
        `/api/${router.query.store}/cart/details?address=${account}`,
        {
          cart: items,
        }
      );

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

  const total = queryResp.data?.reduce(
    (acc: any, item: any) => acc + item.quantity * item.price,
    0
  );

  return (
    <Container maxW="100%" px={{ base: "2", md: "24" }}>
      <Stack w="100%" align="center" p={{ base: "4", md: "8" }}>
        <Heading fontSize={{ base: "xl", md: "3xl" }} fontWeight="300">
          Your Cart ({cartStore?.items.length ?? 0} item)
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

        {queryResp.isLoading && (
          <Stack align="center" justify="center" h="200px">
            <CircularProgress isIndeterminate color="black" />
          </Stack>
        )}

        {!queryResp.isLoading && !queryResp.data?.length && (
          <Stack align="center" justify="center">
            <Text>Your cart is empty</Text>
          </Stack>
        )}

        {queryResp.data?.map((item: any) => (
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
        <Stack direction="row" justify="space-between" py={2}>
          <Stack direction="column" spacing={4}>
            <Text>Subtotal</Text>
            <Text>Network Fee</Text>
            <Text>Total</Text>
          </Stack>
          <Stack direction="column" spacing={4}>
            <Text>:</Text>
            <Text>:</Text>
            <Text>:</Text>
          </Stack>
          <Stack direction="column" fontWeight="bold" spacing={4}>
            <Text>${total}</Text>
            <Text>$1</Text>
            <Text>${total + 1}</Text>
          </Stack>
        </Stack>

        <Text fontSize="sm">Shipping will be calculated at next step</Text>

        <NextLink href={`/${router?.query.store}/shipping`} passHref>
          <Button size="lg" variant="solid" width="100%">
            Proceed to Checkout
          </Button>
        </NextLink>
      </Stack>
    </Container>
  );
};

const Cart: NextPage = () => {
  return (
    <CustomerLayout title="Cart">
      <CartLayout />
    </CustomerLayout>
  );
};
export default Cart;
