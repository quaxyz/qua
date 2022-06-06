import React from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "components/link";
import prisma from "libs/prisma";
import { useRouter } from "next/router";
import {
  Button,
  chakra,
  Container,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FileGallery } from "components/file-gallery";
import CustomerLayout from "components/layouts/customer";
import { Quantity } from "components/quantity";
import { useCartStore } from "hooks/useCart";
import { formatCurrency } from "libs/currency";
import SelectMenu from "components/select";

const Page = ({ product, store }: any) => {
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [variantData, setVariantData] = React.useState<any>({});
  const [variantPrice, setVariantPrice] = React.useState<number | null>(null);
  const cart = useCartStore();

  const handleAddToCart = () => {
    cart?.addCartItem({
      productId: product.id,
      quantity,
      variants: variantData,
    });

    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!cart?.items.find((i) => i.productId === product.id)) {
      cart?.addCartItem({
        productId: product.id,
        quantity,
        variants: variantData,
      });
    }

    router.push({
      pathname: `/cart`,
    });
  };

  const handleVariantSelect = (type: string, value: any) => {
    setVariantData({
      ...variantData,
      [type]: value,
    });

    const variant = product.variants.find((v: any) => v.type === type);
    const option = variant.options.find((o: any) => o.option === value);

    if (
      option.price &&
      option.price.length &&
      parseFloat(option.price) &&
      option.price !== product.price
    ) {
      setVariantPrice(parseFloat(option.price));
    }
  };

  return (
    <Container maxW="100%" px={{ base: "4", md: "16" }}>
      <chakra.div>
        <Link
          href="/"
          display="inline-block"
          borderBottom="none"
          _hover={{ transform: "scale(1.05)" }}
          textDecoration="underline"
        >
          <Stack
            direction="row"
            spacing={4}
            px={4}
            py={{ base: "4", md: "8" }}
            align="center"
          >
            <Text fontSize="inherit" fontWeight="600">
              Go Back
            </Text>
          </Stack>
        </Link>
      </chakra.div>

      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 8, md: 12 }}
      >
        <FileGallery images={product.images} alt={product.name} />

        <Stack
          w="full"
          flex={1}
          pl={{ base: "0", md: "16" }}
          pt={{ base: "0", md: "8" }}
        >
          <chakra.article p={2}>
            <Stack direction="column" py={{ base: "2", md: "4" }} spacing={4}>
              <Heading as="h1" size="lg" fontWeight="300">
                {product.name}
              </Heading>

              {product.totalStocks !== 0 && (
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
                <Text fontWeight="700">
                  {formatCurrency(
                    variantPrice || product.price,
                    store.currency
                  )}
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

              {(product.variants || []).map((variant: any, idx: number) => (
                <Stack align="flex-start" key={idx}>
                  <Text
                    as="span"
                    color="#000"
                    opacity="0.48"
                    fontSize="sm"
                    textTransform="uppercase"
                  >
                    {variant.type}:
                  </Text>

                  <SelectMenu
                    title={variant.type}
                    width={40}
                    variant="outline"
                    value={
                      variantData[variant.type] || variant.options[0].option
                    }
                    onChange={(value) =>
                      handleVariantSelect(variant.type, value)
                    }
                    options={(variant.options || []).map((o: any) => ({
                      value: o.option,
                      label: o.option,
                    }))}
                  />
                </Stack>
              ))}
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
              <Text w={{ base: "100%", md: "67.5rem" }}>
                {product.description}
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const stores = await prisma.store.findMany({
    select: {
      name: true,
      products: {
        select: {
          id: true,
        },
      },
    },
  });

  const paths = [];
  for (let store of stores) {
    for (let product of store.products) {
      paths.push({
        params: {
          store: store.name,
          id: `${product.id}`,
        },
      });
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.store || !params?.id) {
    return {
      notFound: true,
    };
  }

  const store = await prisma.store.findUnique({
    where: { name: params.store as string },
  });
  if (!store) {
    return {
      notFound: true,
    };
  }

  const product = await prisma.product.findFirst({
    where: {
      id: parseInt(params.id as string, 10),
      Store: {
        id: store.id,
      },
    },

    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      totalStocks: true,
      variants: true,
      images: true,
    },
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      store: {
        currency: store.currency,
      },
      layoutProps: {
        title: `${product.name} - ${store.name}`,
      },
    },

    revalidate: 24 * 60 * 60, // 24 hours
  };
};

Page.Layout = CustomerLayout;
export default Page;
