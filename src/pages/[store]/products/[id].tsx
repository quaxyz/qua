import React from "react";
import type { GetServerSideProps } from "next";
import NextLink from "next/link";
import prisma from "libs/prisma";
import { useRouter } from "next/router";
import {
  Button,
  chakra,
  Container,
  Heading,
  Link,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { FileGallery } from "components/file-gallery";
import { Quantity } from "components/quantity";
import { formatCurrency } from "libs/currency";
import { useCartStore } from "hooks/useCart";

const Page = ({ product, storeDetails }: any) => {
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const useCart = useCartStore();

  const handleAddToCart = () => {
    useCart?.addCartItem(
      {
        productId: product.id,
        quantity,
      },
      product.price
    );

    setQuantity(1);
  };

  const handleBuyNow = async () => {
    await useCart?.addCartItem(
      {
        productId: product.id,
        quantity,
      },
      product.price
    );

    router.push({
      pathname: `/[store]/cart`,
      query: { store: router.query.store },
    });
  };

  return (
    <Container maxW="100%" px={{ base: "4", md: "16" }}>
      <chakra.div>
        <NextLink href={`/${router?.query.store}`} passHref>
          <Link
            display="block"
            borderBottom="none"
            textDecoration="underline"
            px={4}
            py={{ base: 4, md: 8 }}
            fontSize="inherit"
            fontWeight="600"
            _hover={{ transform: "scale(1.05)" }}
          >
            Back
          </Link>
        </NextLink>
      </chakra.div>

      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 8, md: 14 }}
      >
        <FileGallery images={product.images} alt={product.name} />

        <Stack w="full" flex={1}>
          <chakra.article p={2}>
            <Stack direction="column" py={{ base: "2", md: "4" }} spacing={4}>
              <Heading as="h1" size="lg" mb={4} fontWeight="300">
                {product.name}
              </Heading>
              {!!product.totalStocks && (
                <Text
                  as="span"
                  fontSize="sm"
                  textTransform="uppercase"
                  color="#027857"
                  mb={4}
                >
                  In stock
                </Text>
              )}
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
                {/* TODO: currency display */}
                <Text fontWeight="700">
                  {formatCurrency(product.price, storeDetails?.currency)}
                </Text>
              </Stack>
              <Stack align="flex-start">
                <Text
                  as="span"
                  color="#000"
                  opacity="0.48"
                  fontSize="sm"
                  textTransform="uppercase"
                >
                  Quantity:
                </Text>

                <Quantity
                  quantity={quantity}
                  setQuantity={(v) => setQuantity(v)}
                  max={product.totalStocks || Infinity}
                  min={1}
                />
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
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              <Button
                size="lg"
                variant="solid"
                width={{ base: "100%", md: "16rem" }}
                onClick={handleBuyNow}
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
          </TabList>

          <TabPanels>
            <TabPanel>
              <Text>{product.description}</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = params?.store as string;
  const id = params?.id as string;

  const product = await prisma.product.findFirst({
    where: {
      id: parseInt(id, 10),
      Store: {
        name: store,
      },
    },

    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      totalStocks: true,
      images: {
        select: {
          url: true,
        },
      },
    },
  });

  const storeDetails = await prisma.store.findUnique({
    where: { name: store },
    select: { currency: true },
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
      storeDetails,

      layoutProps: {
        title: product.name,
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
