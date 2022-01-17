import React from "react";
import type { GetServerSideProps } from "next";
import NextLink from "next/link";
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
import CustomerLayout from "components/layouts/customer-dashboard";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-iconly";
import { getAddressFromCookie } from "libs/cookie";

const Page = () => {
  const router = useRouter();

  return (
    <Container
      maxW={{ base: "100%", md: "container.xl" }}
      px={{ base: "4", md: "16" }}
    >
      <NextLink href={`/${router?.query.store}/orders/`} passHref>
        <Link borderBottom="none">
          <Stack
            direction="row"
            align="center"
            spacing={2}
            py={{ base: "4", md: "8" }}
            mt={{ base: "0", md: "8" }}
          >
            <ArrowLeft set="light" />
            <chakra.span display="inline-block" fontSize="md" fontWeight="600">
              <Text>Order Details</Text>
            </chakra.span>
          </Stack>
        </Link>
      </NextLink>

      <chakra.section>
        <Stack
          direction="row"
          align="center"
          justify="space-between"
          spacing={{ base: "4", md: "8" }}
          pb={{ base: "none", md: "8" }}
          py={2}
          borderTop="1px dashed rgba(0, 0, 0, 12%)"
          borderBottom="1px dashed rgba(0, 0, 0, 12%)"
        >
          <Stack>
            <Text>Order Number: 393666623</Text>
            <Text>1 items</Text>
            <Text>Placed on 09.11.2021</Text>
            <Text>Total: $200.00</Text>
          </Stack>

          <Button variant="solid-outline">Track Order</Button>
        </Stack>
      </chakra.section>

      <Heading
        as="h3"
        color="#000"
        py={{ base: "4", md: "6" }}
        fontSize={{ base: "lg", md: "1xl" }}
      >
        Items in your order
      </Heading>

      <Stack direction="column" w="100%" pb={2}>
        <Stack
          direction="row"
          w="100%"
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
            <NextLink href={`/${router?.query.store}/orders/orderId`}>
              <Link>
                <chakra.span mt="1rem" fontSize="sm" display="inline-block">
                  Cancel Item
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
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = ctx.params?.store as string;
  const address = getAddressFromCookie(true, ctx);

  const props: any = {
    layoutProps: {
      title: "Order Details",
    },
  };

  return { props };
};

Page.Layout = CustomerLayout;
export default Page;
