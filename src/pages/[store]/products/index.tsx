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

const ProductList = () => {
  const router = useRouter();

  return (
    <chakra.section>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: "4", md: "8" }}
        pb={{ base: "none", md: "8" }}
      >
        {[1, 2, 3, 4].map((index) => (
          <NextLink
            href={`/${router?.query.store}/products/productId`}
            passHref
            key={index}
          >
            <Stack
              w={{ base: "100%", md: "25rem" }}
              height={{ base: "100%", md: "25rem" }}
            >
              <Image
                boxSize="25rem"
                objectFit="cover"
                src="/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
                alt="Product Image"
              />
              <Heading as="h1" size="md" fontWeight="300">
                VESONAL Spring Nike shoes Footwear Big Size 38-46{" "}
              </Heading>
              <chakra.strong>$200.00</chakra.strong>
            </Stack>
          </NextLink>
        ))}
      </Stack>
    </chakra.section>
  );
};

const Products: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Product">
      <Container maxW="100%" px={{ base: "4", md: "16" }}>
        <NextLink href={`/${router?.query.store}/products/`} passHref>
          <Link
            borderBottom="none"
            _hover={{ transform: "scale(1.05)" }}
            {...(router.asPath.includes("/products")
              ? { textDecoration: "underline" }
              : { color: "#000" })}
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
        <Stack spacing={{ base: "4", md: "24" }} mb={{ base: "8", md: "24" }}>
          <ProductList />
          <ProductList />
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default Products;
