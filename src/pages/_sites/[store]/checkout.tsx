import React from "react";
import prisma from "libs/prisma";
import _capitalize from "lodash.capitalize";
import CustomerLayout from "components/layouts/customer";
import { GetStaticProps } from "next";
import { getQueryClient } from "libs/react-query";
import { dehydrate } from "react-query";
import {
  Button,
  chakra,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatCurrency } from "libs/currency";
import { useCart } from "hooks/useCart";
import { useRouter } from "next/router";
import { Product } from "components/product";

const PageHeader = ({ store }: any) => {
  return (
    <chakra.header>
      <chakra.div
        bgImage={`linear-gradient(0deg, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.24)), url('${store.image?.url}')`}
        bgPosition="center center"
        bgRepeat="no-repeat"
        bgSize="cover"
        maxW="100%"
        h={{ base: "30vh", md: "50vh" }}
      >
        <Container h="100%" maxW="container.xl" pb={{ base: 10, md: 20 }}>
          <Stack h="100%" justifyContent="flex-end">
            <Heading
              as="h1"
              color="#fff"
              fontWeight="900"
              fontSize={{ base: "2rem", md: "4rem" }}
            >
              Checkout
            </Heading>
          </Stack>
        </Container>
      </chakra.div>
    </chakra.header>
  );
};

const shareMsgTemplate = ({ items, name, deliveryInfo }: any) => `
Hello, I want to place a new order

${items.join("\n")}

Name: ${name}
${deliveryInfo}
`;

const Page = ({ store, products }: any) => {
  const router = useRouter();

  // cart sync
  const cart = useCart();
  React.useEffect(() => {
    if (cart?.synced && !cart?.items.length) {
      router.push("/");
    }
  }, [cart?.synced, cart?.items.length, router]);

  const [contactDetails, setContactDetails] = React.useState({
    name: "",
    phone: "",
  });

  const [deliveryDetails, setDeliveryDetails] = React.useState({
    method: "DELIVERY",
    address: "",
  });

  const onSubmit = (e: any) => {
    e.preventDefault();

    const number = store.socialLinks.whatsapp.replace("+", "").replace(" ", "");
    const items = cart?.items.map((item) => {
      const product = products.find((p: any) => p.id === item.productId);
      const variant = Object.keys(item.variants || {})
        .map((v) => (item.variants || {})[v]?.option)
        .join(", ");

      return `${item.quantity} ${product.name} - ${variant}`;
    });

    const deliveryInfo =
      deliveryDetails.method === "PICKUP"
        ? "I'll pickup myself"
        : `Address: ${deliveryDetails.address}`;

    const msg = shareMsgTemplate({
      items,
      name: contactDetails.name,
      deliveryInfo,
    });

    const link = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank");
  };

  return (
    <>
      <PageHeader store={store} />

      <Container
        as="form"
        px={{ base: 4, md: 4 }}
        maxW="container.xl"
        onSubmit={onSubmit}
      >
        <Stack
          w="full"
          spacing={{ base: 8, md: 28 }}
          alignItems="stretch"
          direction={{ base: "column", md: "row" }}
        >
          <chakra.div
            flex="1"
            mt={{ base: 8, md: 20 }}
            mb={{ base: 4, md: 20 }}
          >
            <Stack spacing={{ base: 8, md: 16 }}>
              {/* contact info */}
              <Stack spacing={6}>
                <chakra.header>
                  <Stack direction="row" justify="space-between">
                    <Heading
                      as="h2"
                      fontSize={{ base: "xl", md: "2xl" }}
                      color="rgb(0 0 0 / 80%)"
                    >
                      Contact details
                    </Heading>
                  </Stack>
                </chakra.header>

                <Stack
                  py={2}
                  spacing={4}
                  borderBottom="1px solid rgba(0, 0, 0, 15%)"
                >
                  <Stack
                    pb={4}
                    spacing={8}
                    direction={{ base: "column", md: "row" }}
                  >
                    <FormControl id="name" isRequired>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        variant="outline"
                        isRequired
                        value={contactDetails.name}
                        onChange={(e) =>
                          setContactDetails({
                            ...contactDetails,
                            name: e.target.value,
                          })
                        }
                      />
                    </FormControl>

                    <FormControl id="phone">
                      <FormLabel htmlFor="phone">Phone</FormLabel>
                      <Input
                        type="tel"
                        pattern="^\+?\d{0,13}"
                        variant="outline"
                        placeholder="+12 345678901"
                        value={contactDetails.phone}
                        onChange={(e) =>
                          setContactDetails({
                            ...contactDetails,
                            phone: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>

              {/* delivery info */}
              <Stack spacing={6}>
                <chakra.header>
                  <Stack direction="row" justify="space-between">
                    <Heading
                      as="h2"
                      fontSize={{ base: "xl", md: "2xl" }}
                      color="rgb(0 0 0 / 80%)"
                    >
                      Delivery details
                    </Heading>
                  </Stack>
                </chakra.header>

                <Stack pt={2} spacing={4}>
                  <Heading
                    as="h4"
                    fontSize={{ base: "md", md: "lg" }}
                    color="rgb(0 0 0 / 70%)"
                  >
                    How?
                  </Heading>

                  <RadioGroup
                    name="delivery-method"
                    value={deliveryDetails.method}
                    onChange={(value) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        method: value,
                      })
                    }
                  >
                    <Stack spacing={8}>
                      <Radio size="lg" value="DELIVERY">
                        <Stack spacing={0} ml={2}>
                          <Text fontWeight="600">Delivery</Text>
                          <Text
                            fontSize="sm"
                            fontWeight="light"
                            color="rgb(0 0 0 / 60%)"
                          >
                            Deliver to my address
                          </Text>
                        </Stack>
                      </Radio>

                      <Radio size="lg" value="PICKUP">
                        <Stack spacing={0} ml={2}>
                          <Text fontWeight="600">Pickup</Text>
                          <Text
                            fontSize="sm"
                            fontWeight="light"
                            color="rgb(0 0 0 / 60%)"
                          >
                            I&apos;ll pick it up myself
                          </Text>
                        </Stack>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Stack>

                {deliveryDetails.method === "DELIVERY" && (
                  <Stack
                    pt={2}
                    pb={6}
                    spacing={4}
                    borderBottom="1px solid rgba(0, 0, 0, 15%)"
                  >
                    <Heading
                      as="h4"
                      color="rgb(0 0 0 / 70%)"
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      Where?
                    </Heading>

                    <FormControl id="address" isRequired isInvalid={false}>
                      <Input
                        type="text"
                        placeholder="Where you want the delivery"
                        variant="outline"
                        isRequired
                        value={deliveryDetails.address || ""}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            address: e.target.value,
                          })
                        }
                      />
                      <FormErrorMessage>Addrss is required</FormErrorMessage>
                    </FormControl>
                  </Stack>
                )}
              </Stack>

              {/* items */}
              <Stack spacing={6}>
                <chakra.header>
                  <Stack direction="row" justify="space-between">
                    <Heading
                      as="h2"
                      fontSize={{ base: "xl", md: "2xl" }}
                      color="rgb(0 0 0 / 80%)"
                    >
                      Items
                    </Heading>
                  </Stack>
                </chakra.header>

                <Stack
                  pt={{ md: 2 }}
                  ml={{ md: "4% !important" }}
                  spacing={0}
                  alignItems="center"
                >
                  {cart?.items.map((item, idx) => {
                    const product: any = (products || []).find(
                      (p: any) => p.id === item.productId
                    );

                    return (
                      <React.Fragment key={item.id}>
                        {idx === 0 && (
                          <Divider borderColor="rgb(0 0 0 / 10%)" />
                        )}

                        <Product product={product} store={store} />

                        {!!cart.items.length && (
                          <Divider borderColor="rgb(0 0 0 / 10%)" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>
          </chakra.div>

          <chakra.div flex="1">
            <chakra.div
              w={{ md: "75%" }}
              px={{ md: 6 }}
              py={{ md: 6 }}
              ml="auto"
              top="120px"
              rounded="md"
              boxShadow={{ md: "md" }}
              bgColor="#fff"
              position="sticky"
              border={{ md: "0.5px solid rgb(0 0 0 / 20%)" }}
              mt={{ base: 0, md: "-2em !important" }}
            >
              <chakra.header>
                <Stack direction="row" justify="space-between">
                  <Heading
                    as="h2"
                    fontSize={{ base: "xl", md: "2xl" }}
                    color="rgb(0 0 0 / 80%)"
                  >
                    Prices
                  </Heading>
                </Stack>
              </chakra.header>

              <Stack py={6}>
                <Stack direction="row" justify="space-between">
                  <Text>Item Subtotal ({cart?.totalItems}) </Text>
                  <Text>
                    {formatCurrency(cart?.totalAmount || 0, store.currency)}
                  </Text>
                </Stack>

                {store.deliveryFee && (
                  <Stack direction="row" justify="space-between">
                    <Text>Delivery </Text>
                    <Text>
                      {formatCurrency(store.deliveryFee, store.currency)}
                    </Text>
                  </Stack>
                )}
              </Stack>

              <Stack py={4} direction="row" justify="space-between">
                <Text fontWeight="600">Total</Text>
                <Text>
                  {formatCurrency(
                    (store.deliveryFee || 0) + (cart?.totalAmount || 0),
                    store.currency
                  )}
                </Text>
              </Stack>

              <Button
                h={14}
                isFullWidth
                type="submit"
                variant="primary"
                colorScheme="black"
              >
                Send order via WhatsApp
              </Button>
            </chakra.div>
          </chakra.div>
        </Stack>
      </Container>
    </>
  );
};

export const getStaticPaths = async () => {
  const stores = await prisma.store.findMany({
    select: {
      name: true,
    },
  });

  return {
    paths: stores.map((store) => ({
      params: { store: store.name as string, path: [] },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = getQueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  });

  if (!params?.store) {
    return {
      notFound: true,
    };
  }

  const store = await prisma.store.findUnique({
    where: { name: params.store as string },
    select: {
      id: true,
      name: true,
      currency: true,
      title: true,
      about: true,
      deliveryFee: true,
      socialLinks: true,
      location: true,
      category: true,
      image: {
        select: {
          url: true,
        },
      },
    },
  });

  if (!store) {
    return {
      notFound: true,
    };
  }

  const products = await prisma.product.findMany({
    take: 50,
    where: {
      Store: {
        id: store.id,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      images: true,
      variants: true,
      totalStocks: true,
    },
  });

  // add data to react-query cache
  await queryClient.prefetchQuery("store", () => store);
  await queryClient.prefetchQuery("products", () => products);

  return {
    props: {
      store,
      dehydratedState: dehydrate(queryClient),
      products: JSON.parse(JSON.stringify(products)),
      layoutProps: {
        store,
        hideOrderBtn: true,
        title: `Checkout - ${_capitalize(store.title || store.name)} - Qua`,
      },
    },

    revalidate: 24 * 60 * 60, // 24 hours
  };
};

Page.Layout = CustomerLayout;
export default Page;
