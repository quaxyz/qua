import { Container, Link, Text } from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Products: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Product">
      <Container maxW="100%" py={12} px={16}>
        <NextLink href={`/${router?.query.store}/products/`} passHref>
          <Link borderBottom="none" _hover={{ transform: "scale(1.05)" }}>
            <Text color="inherit" fontSize="inherit" fontWeight="600">
              All
            </Text>
          </Link>
        </NextLink>
      </Container>
    </CustomerLayout>
  );
};

export default Products;
