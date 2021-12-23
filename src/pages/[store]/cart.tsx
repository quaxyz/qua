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
import CustomerLayout from "components/layouts/customer-dashboard";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Delete } from "react-iconly";

const CartList = () => {
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
      {[1, 2, 3].map((index) => (
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
                  variant="flushed"
                  colorScheme="teal"
                  aria-label="Send email"
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
                <chakra.strong>$200.00</chakra.strong>
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
                <chakra.strong>$200.00</chakra.strong>
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
                    colorScheme="teal"
                    aria-label="Send email"
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

const Cart: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Cart">
      <Container maxW="100%" px={{ base: "2", md: "16" }}>
        <Stack w="100%" align="center" p={{ base: "4", md: "8" }}>
          <Heading fontSize={{ base: "xl", md: "3xl" }} fontWeight="300">
            Your Cart (1 item)
          </Heading>
        </Stack>
        <CartList />
        <Stack
          width={{ base: "100%", md: "21.813rem" }}
          p={4}
          my={4}
          float="right"
          position="relative"
          border="0.5px solid rgba(0, 0, 0, 12%)"
        >
          <Stack direction="row" justify="space-between" py={2}>
            <Stack direction="column">
              <Text>Subtotal</Text>
              <Text>Network Fee</Text>
              <Text>Total</Text>
            </Stack>
            <Stack direction="column">
              <Text>:</Text>
              <Text>:</Text>
              <Text>:</Text>
            </Stack>
            <Stack direction="column" fontWeight="bold">
              <Text>$200</Text>
              <Text>$1</Text>
              <Text>$200</Text>
            </Stack>
          </Stack>
          <Text fontSize="0.938rem">
            Shipping will be calculated at next step
          </Text>
          <Button size="md" variant="solid" width="100%">
            Proceed to Checkout
          </Button>
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default Cart;
