import {
  Button,
  Container,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Success: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Success">
      <Container maxW="100%" py={{ base: "12", md: "24" }}>
        <Stack
          w="100%"
          align="center"
          justify="center"
          p={{ base: "4", md: "8" }}
        >
          <Stack align="center" mb="8">
            <Image
              boxSize={{ base: "12", md: "16" }}
              objectFit="cover"
              src="/svg/check.svg"
              alt="Green check"
              mb="2"
            />
            <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }}>
              Payment Confirmed
            </Heading>
            <Text fontSize={{ base: "0.938rem", md: "lg" }}>
              Thank you for shopping on shooshow
            </Text>
          </Stack>

          <Stack align="center" spacing="8">
            <Text fontSize={{ base: "0.938rem", md: "lg" }}>
              Order Number: 393666623
            </Text>
            <NextLink href="#" passHref>
              <Link isExternal>View on etherscan</Link>
            </NextLink>
            <NextLink href={`/${router?.query.store}/orders/orderId`} passHref>
              <Button size="lg" variant="solid-outline">
                See order details
              </Button>
            </NextLink>
          </Stack>
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default Success;
