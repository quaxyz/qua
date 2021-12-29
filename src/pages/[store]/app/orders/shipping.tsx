import {
  Box,
  chakra,
  Container,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ArrowLeft, Search } from "react-iconly";

const Shipping: NextPage = () => {
  const router = useRouter();

  return (
    <StoreDashboardLayout title="Fufill Order">
      <Container maxW="100%" px={{ base: "4", md: "16" }} mb={8}>
        <NextLink href={`/${router?.query.store}/app/orders/orderId`} passHref>
          <Link borderBottom="none">
            <Stack
              direction="row"
              align="center"
              spacing={2}
              mt={{ base: "8", md: "16" }}
              // py={{ base: "", md: "4" }}
            >
              <ArrowLeft set="light" />
              <chakra.span
                display="inline-block"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
              >
                <Text>Shipping</Text>
              </chakra.span>
            </Stack>
          </Link>
        </NextLink>

        <Stack>
          <Text color="#000" opacity="0.72" py={{ base: "4", md: "4" }}>
            Continue with your preffered delivery services
          </Text>
          <Box maxW="403px" pt="5px" pb={{ base: "28px", md: "45px" }}>
            <InputGroup>
              <InputLeftElement
                fontSize="1rem"
                pointerEvents="none"
                // eslint-disable-next-line react/no-children-prop
                children={
                  <Icon
                    // boxSize="4px"
                    as={() => <Search set="light" primaryColor="#0E0F0F" />}
                  />
                }
              />
              <Input type="search" placeholder="Search" />
            </InputGroup>
          </Box>
        </Stack>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "8", md: "12rem" }}
        >
          <Stack flex={1}>
            <Box>FedEx</Box>
            <Box>DHL</Box>
            <Box>Delivr</Box>
            <Box>Gokada</Box>
            <Box>Uber</Box>
            <Box>Bolt</Box>
          </Stack>
        </Stack>
      </Container>
    </StoreDashboardLayout>
  );
};

export default Shipping;
