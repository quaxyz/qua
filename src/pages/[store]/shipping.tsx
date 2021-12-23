import { Container, Heading, Stack } from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const Cart: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Cart">
      <Container maxW="100%" px={{ base: "2", md: "16" }}>
        <Stack>
          <Heading>Shipping Details</Heading>
          <Stack direction="row" justify="space-between" py={2}></Stack>
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default Cart;
