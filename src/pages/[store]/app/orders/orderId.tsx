import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { truncateAddress } from "libs/utils";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ArrowLeft } from "react-iconly";

const Details: NextPage = () => {
  const router = useRouter();

  return (
    <StoreDashboardLayout title="Product Details">
      <Container maxW="100%" px={{ base: "4", md: "16" }} mb={8}>
        <NextLink href={`/${router?.query.store}/app/orders/`} passHref>
          <Link borderBottom="none">
            <Stack
              direction="row"
              align="center"
              spacing={2}
              py={{ base: "4", md: "8" }}
              mt={{ base: "0", md: "8" }}
            >
              <ArrowLeft set="light" />
              <chakra.span
                display="inline-block"
                fontSize="md"
                fontWeight="600"
              >
                <Text>Order Details</Text>
              </chakra.span>
            </Stack>
          </Link>
        </NextLink>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "8", md: "12rem" }}
        >
          <Stack flex={2}>
            <Stack
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
            >
              <Stack
                direction="row"
                align="center"
                spacing={{ base: "4", md: "8" }}
              >
                <Heading as="h4" fontSize={{ base: "md", md: "2xl" }}>
                  Order #1003
                </Heading>

                <Stack direction="row" pr={{ base: "2", md: "4" }}>
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    bgColor="rgba(205, 254, 240, 1)"
                    color="rgba(2, 120, 87, 1)"
                    borderRadius="8px"
                    px="12px"
                    py="4px"
                    textAlign="center"
                  >
                    Paid
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    bgColor="rgba(254, 238, 205, 1)"
                    color="rgba(120, 81, 2, 1)"
                    lineHeight="1.5"
                    borderRadius="8px"
                    px="12px"
                    py="4px"
                    textAlign="center"
                  >
                    Unfulfilled
                  </Text>
                </Stack>
              </Stack>
              <Stack>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  06.22.2021 at 10:14am
                </Text>
              </Stack>
            </Stack>

            <Heading
              py={{ base: "4", md: "8" }}
              fontSize={{ base: "md", md: "xl" }}
            >
              Unfulfilled 2
            </Heading>
            <Stack
              direction="row"
              w="100%"
              height="100%"
              p={2}
              spacing={{ base: "2", md: "4" }}
              border="0.5px solid rgba(0, 0, 0, 12%)"
            >
              <Box>
                <Image
                  width="12rem"
                  height="6.25rem"
                  display={{ base: "block", md: "none" }}
                  objectFit="cover"
                  src="/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
                  alt="Product Image"
                />
                <Image
                  boxSize="100"
                  display={{ base: "none", md: "block" }}
                  objectFit="cover"
                  src="/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
                  alt="Product Image"
                />
                <NextLink href={`/${router?.query.store}/app/orders/orderId`}>
                  <Link>
                    <chakra.span
                      mt="0.4rem"
                      fontSize="sm"
                      display="inline-block"
                    >
                      Cancel Order
                    </chakra.span>
                  </Link>
                </NextLink>
              </Box>

              <Stack display="block" pt={{ base: "0", md: "2" }}>
                <Heading
                  as="h1"
                  fontSize={{ base: "md", md: "xl" }}
                  fontWeight="300"
                >
                  VESONAL Spring Nike shoes Footwear Big Size 38-46{" "}
                </Heading>
                <chakra.span
                  display="block"
                  py="0.2rem"
                  fontSize={{ base: "xs", md: "sm" }}
                  textTransform="uppercase"
                >
                  QTY: 1
                </chakra.span>
                <chakra.strong>$200.00</chakra.strong>
              </Stack>
            </Stack>

            <Stack py={{ base: "4", md: "24" }}>
              <Heading as="h4" size="md" color="#000">
                Payment Summary
              </Heading>
              <Stack
                width="100%"
                p={2}
                // my={4}

                // border="0.5px solid rgba(0, 0, 0, 12%)"
              >
                <Stack direction="row" justify="space-between" py={2} mb={4}>
                  <Stack direction="column" spacing={4}>
                    <Text>Subtotal</Text>
                    <Text>Delivery</Text>
                    <Text fontWeight="bold">Total paid by customer</Text>
                  </Stack>
                  <Stack direction="column" spacing={4}>
                    <Text>:</Text>
                    <Text>:</Text>
                    <Text>:</Text>
                  </Stack>
                  <Stack direction="column" fontWeight="bold" spacing={4}>
                    <Text>$200</Text>
                    <Text>$10</Text>
                    <Text>$300</Text>
                  </Stack>
                </Stack>

                <Stack direction="row" w="100%">
                  <Button size="lg" variant="solid" width="100%">
                    Fufill Order
                  </Button>
                  <Button size="lg" w="24rem" variant="solid-outline">
                    Cancel Order
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack w="full" flex={1}>
            <Stack
              direction="column"
              p={{ base: "4", md: "6" }}
              spacing={6}
              border="0.5px solid rgba(0, 0, 0, 12%)"
            >
              <Stack spacing={2}>
                <Heading as="h4" size="lg">
                  Customer
                </Heading>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "flex-start", md: "center" }}
                >
                  <Text color="#000">Maria Liuz</Text>
                  <Box
                    cursor="pointer"
                    bg=" rgba(0, 0, 0, 0.04)"
                    rounded="50px"
                    height="100%"
                    px="0.8rem"
                    py="0.4rem"
                    display="inline-block"
                    userSelect="none"
                    textAlign="center"
                  >
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {truncateAddress(
                        "0x1F86E192e75BFEdC227F148f67a88B38Ab14687c" || "",
                        4
                      )}
                    </Text>
                  </Box>
                </Stack>
              </Stack>

              <Stack spacing={2}>
                <Heading as="h4" size="md">
                  Contact info
                </Heading>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  marialuiz@gmail.com
                </Text>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  +1 (223) 123-1234
                </Text>
              </Stack>

              <Stack spacing={2}>
                <Heading as="h4" size="md">
                  Shipping Address
                </Heading>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  160 Sansom St, San Francisco
                </Text>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  Carlifornia
                </Text>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  United States
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </StoreDashboardLayout>
  );
};

export default Details;
