import React, { useEffect, useRef, useState } from "react";
import prisma from "libs/prisma";
import _groupBy from "lodash.groupBy";
import _capitalize from "lodash.capitalize";
import CustomerLayout from "components/layouts/customer";
import { GetStaticProps } from "next";
import { getQueryClient } from "libs/react-query";
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
import { Product } from "components/product";
import { dehydrate } from "react-query";

const PageHeader = ({ store }: any) => {
  return (
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
    </chakra.header>
  );
};

const CategoryList = ({ name, store, products, setActiveCategory }: any) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && typeof IntersectionObserver === "function") {
      const handler = (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.boundingClientRect.top < 160) {
          setActiveCategory(entry.target.id.replace("#", ""));
        }
      };

      const observer = new IntersectionObserver(handler, {
        root: null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      });

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
      };
    }
    return () => {};
  }, [setActiveCategory]);

  return (
    <chakra.div w="full" key={name} ref={containerRef} id={`#${name}`}>
      <Heading
        mb={6}
        as="h2"
        fontSize="2xl"
        fontWeight="700"
        px={{ base: 4, md: 0 }}
        color="rgb(0 0 0 / 90%)"
        textTransform="uppercase"
      >
        {name}
      </Heading>

      <Stack w="full" spacing={0} alignItems="center">
        {products.map((product: any, idx: number) => (
          <React.Fragment key={product.id}>
            {idx === 0 && <Divider borderColor="rgb(0 0 0 / 6%)" />}

            <Product product={product} store={store} />

            {!!products.length && <Divider borderColor="rgb(0 0 0 / 6%)" />}
          </React.Fragment>
        ))}
      </Stack>
    </chakra.div>
  );
};

const Page = ({ products, store }: any) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchFilteredProducts = searchTerm
    ? products.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const categories = _groupBy<any>(searchFilteredProducts, "category");

  const [activeCategory, setActiveCategory] = useState<string>();
  const firstItem = Object.keys(categories)[0];
  useEffect(() => {
    setActiveCategory(firstItem);
  }, [firstItem]);

  const onCategoryClick = (category: string) => {
    const element = document.getElementById(`#${category}`);
    if (!element) return;

    const offsetPosition =
      element.getBoundingClientRect().top + window.pageYOffset - 160;

    window?.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setActiveCategory(category);
  };

  return (
    <>
      <PageHeader store={store} />

      <Container
        px={4}
        mt={-9}
        maxW="container.xl"
        display={{ base: "none", md: "block" }}
      >
        <Stack
          py={6}
          px={6}
          w="100%"
          bg="#fff"
          spacing={6}
          rounded="lg"
          boxShadow="base"
          alignContent="center"
        >
          <chakra.form w="full" onSubmit={(e) => e.preventDefault()}>
            <InputGroup size={useBreakpointValue({ base: "sm", md: "md" })}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} />
              </InputLeftElement>

              <Input
                w="full"
                id="search"
                value={searchTerm}
                placeholder="Search"
                border={{ md: "none" }}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant={useBreakpointValue({
                  base: "filled",
                  md: "outline",
                })}
              />
            </InputGroup>
          </chakra.form>
        </Stack>
      </Container>

      <Container
        my={{ base: 0, md: 14 }}
        px={{ base: 0, md: 4 }}
        maxW="container.xl"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={14}
          w="full"
          alignItems="stretch"
        >
          <chakra.div flex="1" display={{ base: "none", md: "block" }}>
            <Stack spacing={4} position="sticky" top="180px">
              {Object.keys(categories).map((category: string) => (
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
                  isActive={activeCategory === category}
                  onClick={() => onCategoryClick(category)}
                  _hover={{
                    transform: "none",
                    color: "rgb(0 0 0 / 100%)",
                    _after: {
                      width: "100%",
                    },
                  }}
                  _active={{
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

          <Stack
            flex="4"
            spacing={16}
            mt={{
              base: "0px !important",
              md: `calc(var(--chakra-space-16) * -1) !important`,
            }}
          >
            <Stack
              py={4}
              bg="#fff"
              spacing={6}
              rounded="none"
              alignContent="center"
              px={{ base: 4, md: 0 }}
              display={{ base: "flex", md: "none" }}
            >
              <chakra.form w="full" onSubmit={(e) => e.preventDefault()}>
                <InputGroup size={useBreakpointValue({ base: "sm", md: "md" })}>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} />
                  </InputLeftElement>

                  <Input
                    w="full"
                    id="search"
                    value={searchTerm}
                    placeholder="Search"
                    border={{ md: "none" }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant={useBreakpointValue({
                      base: "filled",
                      md: "outline",
                    })}
                  />
                </InputGroup>
              </chakra.form>
            </Stack>

            <chakra.div
              py={4}
              px={8}
              top={0}
              w="100vw"
              bg="white"
              zIndex="20"
              pos="sticky"
              mt="0 !important"
              ml="-1rem !important"
              boxShadow="0 1px #0000001f"
              display={{ base: "block", md: "none" }}
            >
              <Stack
                bg="#fff"
                spacing={2}
                pos="sticky"
                zIndex="20"
                direction="row"
                overflowX="auto"
                flexWrap="nowrap"
                whiteSpace="nowrap"
                sx={{
                  scrollbarWidth: 0,
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {Object.keys(categories).map(
                  (category: string, idx: number) => (
                    <Button
                      key={idx}
                      size="xs"
                      rounded="lg"
                      minW="intial"
                      display="flex"
                      variant="ghost"
                      colorScheme="gray"
                      textTransform="uppercase"
                      isActive={activeCategory === category}
                      onClick={(e) => {
                        e.currentTarget.scrollIntoView({ behavior: "smooth" });
                        onCategoryClick(category);
                      }}
                    >
                      {category}
                    </Button>
                  )
                )}
              </Stack>
            </chakra.div>

            {Object.keys(categories).map((categoryName) => (
              <CategoryList
                store={store}
                key={categoryName}
                name={categoryName}
                setActiveCategory={setActiveCategory}
                products={categories[categoryName]}
              />
            ))}
          </Stack>

          <chakra.div flex="2">
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
                <Heading
                  as="h6"
                  fontSize="md"
                  fontWeight="600"
                  color="rgb(0 0 0 / 80%)"
                >
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
                <Heading
                  as="h6"
                  pb={1}
                  fontSize="md"
                  fontWeight="600"
                  color="rgb(0 0 0 / 80%)"
                >
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
                <Heading
                  as="h6"
                  fontSize="md"
                  fontWeight="600"
                  color="rgb(0 0 0 / 80%)"
                >
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
      variants: true,
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

  // add data to react-query cache
  await queryClient.prefetchQuery("store", () => store);
  await queryClient.prefetchQuery("products", () => data);
  await queryClient.prefetchQuery("categories", () => allCategories);

  return {
    props: {
      store,
      allCategories,
      dehydratedState: dehydrate(queryClient),
      products: JSON.parse(JSON.stringify(data)),
      layoutProps: {
        store,
        title: `${_capitalize(store.title || store.name)} - Qua`,
      },
    },

    revalidate: 24 * 60 * 60, // 24 hours
  };
};

Page.Layout = CustomerLayout;
export default Page;
