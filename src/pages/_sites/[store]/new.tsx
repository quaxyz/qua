import React from "react";
import prisma from "libs/prisma";
import _groupBy from "lodash.groupBy";
import _capitalize from "lodash.capitalize";
import NextLink from "next/link";
import NextImage from "next/image";
import CustomerLayout from "components/layouts/customer";
import { GetStaticProps } from "next";
import {
  Button,
  chakra,
  Container,
  Divider,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { defaultCategories } from "libs/constants";
import { formatCurrency } from "libs/currency";
import { FiSearch } from "react-icons/fi";
import { mapSocialLink } from "libs/utils";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";

const Page = ({ products, store, allCategories }: any) => {
  const categories = _groupBy<any>(products, "category");

  return (
    <>
      <chakra.header>
        <chakra.div
          bgImage={`linear-gradient(0deg, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.24)), url('${store.image?.url}')`}
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="cover"
          maxW="100%"
          h={{ base: "50vh", md: "60vh" }}
        >
          <Container h="100%" maxW="container.xl" pb={20}>
            <Stack h="100%" justifyContent="flex-end">
              <Heading
                as="h1"
                color="#fff"
                fontWeight="900"
                fontSize={{ base: "2rem", md: "4rem" }}
              >
                {store.title}
              </Heading>
              <Text fontWeight="600" color="#fff">
                {store.about}
              </Text>

              <Stack w="fit-content" pt={6}>
                <Text
                  px={4}
                  py={2}
                  bg="#fff"
                  rounded="8px"
                  fontSize="xs"
                  letterSpacing="1.1px"
                  textTransform="uppercase"
                >
                  Delivery:{" "}
                  {formatCurrency(store.deliveryFee || 0, store.currency)}
                </Text>
              </Stack>
            </Stack>
          </Container>
        </chakra.div>

        <Container
          h="100%"
          maxW={{ base: "100%", md: "container.xl" }}
          mt={{ base: -12, md: -9 }}
          px={{ base: 0, md: 4 }}
        >
          <Stack
            w="100%"
            py={{ base: 4, md: 6 }}
            px={{ base: 6, md: 6 }}
            spacing={6}
            rounded={{ base: "none", md: "lg" }}
            bg="#fff"
            boxShadow="base"
            alignContent="center"
          >
            <chakra.form w="full" onSubmit={() => null}>
              <InputGroup size={useBreakpointValue({ base: "sm", md: "md" })}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} />
                </InputLeftElement>

                <Input
                  id="search"
                  border={{ md: "none" }}
                  w="full"
                  variant={useBreakpointValue({
                    base: "filled",
                    md: "outline",
                  })}
                  placeholder="Search"
                />
              </InputGroup>
            </chakra.form>

            <chakra.div display={{ base: "block", md: "none" }}>
              <Stack direction="row" spacing={3}>
                {allCategories.map((category: string, idx: number) => (
                  <Button
                    key={category}
                    size="xs"
                    variant="ghost"
                    colorScheme="gray"
                    textTransform="uppercase"
                    rounded="lg"
                    isActive={idx === 0}
                  >
                    {category}
                  </Button>
                ))}
              </Stack>
            </chakra.div>
          </Stack>
        </Container>
      </chakra.header>

      <Container my={{ base: 7, md: 14 }} maxW="container.xl">
        <Stack direction={{ base: "column", md: "row" }} spacing={16} w="full">
          <chakra.div flex="1" display={{ base: "none", md: "block" }}>
            <Stack spacing={4}>
              {allCategories.map((category: string) => (
                <Button
                  key={category}
                  fontSize="sm"
                  rounded="none"
                  variant="link"
                  w="fit-content"
                  fontWeight="600"
                  borderBottom="none"
                  flexDirection="column"
                  alignItems="flex-start"
                  color="rgb(0 0 0 / 55%)"
                  textTransform="uppercase"
                  _hover={{
                    transform: "none",
                    color: "rgb(0 0 0 / 100%)",
                    _after: {
                      width: "100%",
                    },
                  }}
                  _focus={{
                    outline: "0px",
                    boxShadow: "none !important",
                    border: "none",
                  }}
                  _after={{
                    content: '" "',
                    mt: 1,
                    bgColor: "#000",
                    width: "0px",
                    height: "2px",
                    display: "block",
                    transition: `all ease-in 0.3s`,
                  }}
                >
                  {category}
                </Button>
              ))}
            </Stack>
          </chakra.div>

          <Stack flex="3" spacing={16}>
            {Object.keys(categories).map((categoryName) => {
              const products = categories[categoryName];

              return (
                <chakra.div w="full" key={categoryName} id={`#${categoryName}`}>
                  <Heading
                    mb={6}
                    as="h2"
                    fontSize="2xl"
                    fontWeight="700"
                    textTransform="uppercase"
                    color="rgb(0 0 0 / 90%)"
                  >
                    {categoryName}
                  </Heading>

                  <Stack w="full" spacing={0} alignItems="center">
                    {products.map((product, idx) => (
                      <React.Fragment key={product.id}>
                        {console.log(product)}
                        {idx === 0 && <Divider borderColor="rgb(0 0 0 / 6%)" />}

                        <Stack
                          as={LinkBox}
                          py={8}
                          px="5%"
                          rounded="md"
                          w="110%"
                          direction="row"
                          transition="box-shadow ease-in-out 0.3s"
                          justifyContent="space-between"
                          _hover={{
                            boxShadow: "md",
                          }}
                        >
                          <Stack spacing={2} flex={2}>
                            <NextLink href={`/products/${product.id}`} passHref>
                              <LinkOverlay>
                                <Heading
                                  as="h3"
                                  fontSize="lg"
                                  fontWeight="600"
                                  color="rgb(0 0 0 / 80%)"
                                  textTransform="capitalize"
                                >
                                  {product.name}
                                </Heading>
                              </LinkOverlay>
                            </NextLink>

                            {!!product.description?.length && (
                              <Text
                                fontSize="sm"
                                fontWeight="normal"
                                color="rgb(0 0 0 / 60%)"
                              >
                                {product.description}
                              </Text>
                            )}

                            <Text fontWeight="normal" color="rgb(0 0 0 / 80%)">
                              {formatCurrency(
                                product.price ?? 0,
                                store.currency
                              )}
                            </Text>
                          </Stack>

                          {product.images[0] && (
                            <chakra.div flex={1}>
                              <NextImage
                                width="200em"
                                height="140em"
                                objectFit="cover"
                                style={{ borderRadius: 4 }}
                                src={product.images[0]}
                                alt={product.name}
                              />
                            </chakra.div>
                          )}
                        </Stack>

                        {!!products.length && (
                          <Divider borderColor="rgb(0 0 0 / 6%)" />
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </chakra.div>
              );
            })}
          </Stack>

          <chakra.div flex="1.5">
            <Heading
              mb={6}
              as="h4"
              fontSize="xl"
              fontWeight="700"
              color="rgb(0 0 0 / 90%)"
            >
              Store information
            </Heading>

            <Stack spacing={8}>
              <Stack>
                <Heading as="h6" fontSize="md" color="rgb(0 0 0 / 80%)">
                  Address
                </Heading>

                <Text fontSize="sm">{store.location || "Not available"}</Text>

                {store.location && (
                  <Link
                    isExternal
                    fontSize="sm"
                    w="fit-content"
                    href={`https://www.google.com/maps/search/?api=1&query=${
                      store.location || ""
                    }`}
                  >
                    See map
                  </Link>
                )}
              </Stack>

              <Stack>
                <Heading as="h6" pb={1} fontSize="md" color="rgb(0 0 0 / 80%)">
                  Contact Info
                </Heading>

                {Object.entries(store.socialLinks || {})
                  .filter(([_, value]: any) => value.length)
                  .map(([social, link]: any) => (
                    <Stack direction="row" alignItems="center" key={social}>
                      <Icon
                        aria-label={social}
                        as={
                          social === "whatsapp"
                            ? IoLogoWhatsapp
                            : social === "instagram"
                            ? AiFillInstagram
                            : undefined
                        }
                        color={
                          social === "whatsapp"
                            ? "whatsapp.500"
                            : social === "instagram"
                            ? "#E4405F"
                            : undefined
                        }
                      />

                      <Link
                        key={social}
                        href={mapSocialLink(social, link)}
                        borderBottom="none"
                        _hover={{ textDecoration: "underline" }}
                        fontSize="sm"
                        isExternal
                      >
                        {link}
                      </Link>
                    </Stack>
                  ))}
              </Stack>

              <Stack>
                <Heading as="h6" fontSize="md" color="rgb(0 0 0 / 80%)">
                  Category
                </Heading>

                <Text fontSize="sm">
                  {
                    defaultCategories.find((c) => c.value === store.category)
                      ?.label
                  }
                </Text>
              </Stack>
            </Stack>
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
    paths: stores.map((store) => ({ params: { store: store.name as string } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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

  const data = await prisma.product.findMany({
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
    },
  });

  const distinctCategories = await prisma.product.findMany({
    distinct: ["category"],
    where: {
      Store: { id: store.id },
    },
    select: {
      category: true,
    },
  });
  const allCategories = (distinctCategories || [])
    .map((p) => p.category)
    .filter(Boolean);

  return {
    props: {
      products: JSON.parse(JSON.stringify(data)),
      allCategories,
      store,
      layoutProps: {
        title: `${_capitalize(store.title || store.name)} - Qua`,
      },
    },

    revalidate: 24 * 60 * 60, // 24 hours
  };
};

Page.Layout = CustomerLayout;
export default Page;
