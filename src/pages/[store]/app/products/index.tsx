import {
  Button,
  Container,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Products = () => {
  const router = useRouter();

  return (
    <StoreDashboardLayout title="Products">
      <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
        <Stack direction="row" justify="space-between">
          <Heading as="h2" fontSize="24px" fontWeight="500" color="#000">
            Products
          </Heading>

          <NextLink href={`/${router?.query.store}/app/products/new`} passHref>
            <Button>New Product</Button>
          </NextLink>
        </Stack>

        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          mt={{ base: "8rem", md: "20rem" }}
        >
          <Image
            src="/svg/add.svg"
            alt="Add Icon"
            layout="fixed"
            w={{ base: "20", md: "100" }}
            h={{ base: "20", md: "100" }}
            mb="4"
          />
          <Stack alignItems="center" textAlign="center" justify="center">
            <Text fontSize="xl" fontWeight="bold" color="#000">
              Add and manage your products
            </Text>
            <Text fontSize="lg">
              You can add products and manage your pricing here.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </StoreDashboardLayout>
  );
};

export default Products;
