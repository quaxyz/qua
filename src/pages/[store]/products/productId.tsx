import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Image,
  Link,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Details: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Product Details">
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
                Back
              </Text>
            </Stack>
          </Link>
        </NextLink>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "8", md: "14" }}
        >
          <Stack w="full" flex={1} spacing={10}>
            <chakra.section
              h={{ base: "sm", md: "xl" }}
              w="full"
              pos="relative"
            >
              <Image
                src="/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
                alt="Product image"
                objectFit="cover"
                // objectPosition="center 70%"
                w="full"
                height="full"
                // boxSize={{ base: "100%", md: "44rem" }}
              />
            </chakra.section>
          </Stack>

          <Stack w="full" flex={1}>
            <chakra.article p={2}>
              <Stack direction="column" py={{ base: "2", md: "4" }} spacing={4}>
                <Heading as="h1" size="lg" mb={4} fontWeight="300">
                  VESONAL Spring Nike shoes Footwear Big Size 38-46{" "}
                </Heading>
                <Text
                  as="span"
                  fontSize="sm"
                  textTransform="uppercase"
                  color="#027857"
                  mb={4}
                >
                  In stock
                </Text>
                <Stack>
                  <Text
                    as="span"
                    color="#000"
                    opacity="0.48"
                    fontSize="sm"
                    textTransform="uppercase"
                  >
                    Price:
                  </Text>
                  <chakra.strong>$200.00</chakra.strong>
                </Stack>
                <Stack>
                  <Text
                    as="span"
                    color="#000"
                    opacity="0.48"
                    fontSize="sm"
                    textTransform="uppercase"
                  >
                    Quantity:
                  </Text>
                  <Box width="8rem">
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
                  </Box>
                </Stack>
              </Stack>

              <Stack
                direction={{ base: "column", md: "row" }}
                py={8}
                spacing={4}
                width="100%"
              >
                <Button
                  size="lg"
                  variant="solid-outline"
                  textDecoration="2px underline"
                  width={{ base: "100%", md: "16rem" }}
                >
                  Add to cart
                </Button>
                <Button
                  size="lg"
                  variant="solid"
                  width={{ base: "100%", md: "16rem" }}
                >
                  Buy Now
                </Button>
              </Stack>
            </chakra.article>
          </Stack>
        </Stack>

        <Stack py={{ base: "4", md: "24" }}>
          <Tabs colorScheme="#000000">
            <TabList borderColor="rgba(0, 0, 0, 8%)">
              <Tab>Description</Tab>
              <Tab>Reviews</Tab>
            </TabList>
          </Tabs>
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default Details;
