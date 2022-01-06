import {
  Button,
  chakra,
  Container,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CostSummary } from "components/cost-summary";
import CustomerLayout from "components/layouts/customer-dashboard";
import { useCartStore } from "hooks/useCart";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Delete } from "react-iconly";

const CartList = () => {
  const useCart = useCartStore();
  const subtotal = (item: any) => (item.subtotal = item.price * item.quantity);
  return (
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
      {useCart?.items.map((item, index) => (
        <React.Fragment key={index}>
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
                  onClick={() => useCart?.removeCartItem(item.productId)}
                  variant="flushed"
                  aria-label="Delete"
                  icon={<Delete set="light" />}
                />
                <Image
                  width="12rem"
                  height="6.25rem"
                  objectFit="cover"
                  src="/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
                  alt="Product Image"
                />
              </Stack>
              <Heading as="h1" size="sm" pt={4} fontWeight="300">
                VESONAL Spring Nike shoes Footwear Big Size 38-46{" "}
              </Heading>
            </Stack>

            <Stack w="100%" align="center">
              <Text fontSize="14px">
                <chakra.strong>{`$${200 ?? 0}.00`}</chakra.strong>
              </Text>
            </Stack>

            <Stack w="100%" align="center">
              <Text
                fontSize="14px"
                fontWeight="500"
                bgColor="#000"
                color="#fff"
                px="12px"
                py="4px"
              >
                Incrementor
              </Text>
            </Stack>

            <Stack w="100%" align="center">
              <Text fontSize="14px">
                <chakra.strong>{`$${subtotal(item) ?? 0}.00`}</chakra.strong>
              </Text>
            </Stack>
          </Stack>

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
              spacing={2}
              border="0.5px solid rgba(0, 0, 0, 16%)"
            >
              <Image
                width="12rem"
                height="6.25rem"
                objectFit="cover"
                src="/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
                alt="Product Image"
              />

              <Stack>
                <Stack direction="row" w="100%" spacing={2}>
                  <Heading as="h1" size="sm" fontWeight="300">
                    VESONAL Spring Nike shoes Footwear Big Size 38-46{" "}
                  </Heading>
                  <IconButton
                    variant="flushed"
                    aria-label="Delete"
                    icon={<Delete set="light" />}
                  />
                </Stack>
                <Text fontSize="0.938rem">
                  <chakra.strong>$200.00</chakra.strong>
                </Text>

                <Stack>
                  <Stack direction="row" align="center" w="100%" spacing={2}>
                    <Text fontSize="0.938rem">Subtotal:</Text>
                    <Text fontSize="0.938rem">
                      <chakra.strong>$200.00</chakra.strong>
                    </Text>
                  </Stack>
                  <Stack direction="row" w="100%" spacing={2}>
                    <Text>Qty:</Text>
                    <Text
                      as="div"
                      fontSize="0.938rem"
                      fontWeight="500"
                      bgColor="#000"
                      color="#fff"
                      px="12px"
                      py="4px"
                    >
                      Incrementor
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </React.Fragment>
      ))}
    </Stack>
  );
};

const CartLayout = () => {
  const router = useRouter();
  const cartStore = useCartStore();
  return (
    <Container maxW="100%" px={{ base: "2", md: "24" }}>
      <Stack w="100%" align="center" p={{ base: "4", md: "8" }}>
        <Heading fontSize={{ base: "xl", md: "3xl" }} fontWeight="300">
          Your Cart ({cartStore?.items.length ?? 0} item)
        </Heading>
      </Stack>
      <CartList />

      <Stack
        width={{ base: "100%", md: "24.813rem" }}
        p={4}
        my={4}
        float="right"
        position="relative"
        border="0.5px solid rgba(0, 0, 0, 12%)"
      >
        <CostSummary />
        <Text fontSize="0.938rem">
          Shipping will be calculated at next step
        </Text>
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
