import {
  chakra,
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

const Orders: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Orders">
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
          <Stack
            direction="row"
            w="100%"
            p={{ base: "2", md: "0.75rem" }}
            pr={{ base: "0", md: "2.8rem" }}
            spacing={{ base: "2", md: "4" }}
            border="0.5px solid rgba(0, 0, 0, 16%)"
          >
            <Image
              width={{ base: "12rem", md: "100" }}
              height={{ base: "6.25rem", md: "150" }}
              objectFit="cover"
              src="/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
              alt="Product Image"
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
                VESONAL Spring Nike shoes Footwear Big Size 38-46{" "}
              </Heading>
              <Text fontSize="0.938rem">Order: 393666623</Text>

              <chakra.span
                display="inline-block"
                bg="#5538EE"
                color="#fff"
                px="0.4rem"
                py="0.2rem"
                borderRadius={4}
                fontSize="xs"
                textTransform="uppercase"
              >
                Order in progress
              </chakra.span>
              <NextLink href={`/${router?.query.store}/orders/orderId`}>
                <Link float={{ base: "none", md: "right" }} position="relative">
                  <chakra.span
                    mt="1rem"
                    textTransform="uppercase"
                    display="inline-block"
                  >
                    See details
                  </chakra.span>
                </Link>
              </NextLink>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default Orders;
