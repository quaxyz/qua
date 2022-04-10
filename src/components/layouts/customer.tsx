import React from "react";
import Head from "next/head";
import Link from "components/link";
import useCart from "hooks/useCart";
import {
  Box,
  Center,
  chakra,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CartContext } from "contexts/cart";
import { useRouter } from "next/router";
import { Bag2 } from "react-iconly";

const useNavLinks = () => {
  const router = useRouter();
  return [
    {
      name: "Products",
      url: `/`,
      isActive: router.asPath === "/",
    },
    {
      name: "About",
      url: `/about/`,
      isActive: router.asPath === "/about/",
    },
  ];
};

const CustomerLayout = ({ title, children }: any) => {
  const router = useRouter();
  const navLinks = useNavLinks();
  const cartStore = useCart();

  return (
    <CartContext.Provider value={cartStore}>
      <Head>
        <title>{title}</title>
      </Head>

      <Grid
        templateColumns="1fr"
        templateRows="80px 1fr 70px"
        templateAreas={{
          base: `"topbar topbar" "main main" "bottombar bottombar"`,
          md: `"topbar topbar" "main main" "main main"`,
        }}
        minH="100vh"
      >
        {/* topbar */}
        <chakra.nav
          gridArea="topbar"
          pos="fixed"
          top="0"
          zIndex="2"
          w="100%"
          bg="#fff"
          color="#000"
          borderBottom="1px solid rgba(0, 0, 0, 0.08)"
          px={16}
          py={5}
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" align="center" spacing={24}>
            <Link
              href="/"
              borderBottom="none"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Heading
                fontWeight="800"
                textTransform="capitalize"
                fontSize="2xl"
                px={3}
              >
                {router.query.store}
              </Heading>
            </Link>

            <Stack direction="row" spacing={8}>
              {navLinks.map((navLink, idx) => (
                <Link
                  key={idx}
                  href={`${navLink.url}`}
                  borderBottom="none"
                  _hover={{ transform: "scale(1.05)" }}
                  {...(navLink.isActive
                    ? { textDecoration: "underline" }
                    : { color: "#000" })}
                >
                  <Stack direction="row" spacing={4} align="center">
                    <Text color="inherit" fontSize="inherit" fontWeight="600">
                      {navLink.name}
                    </Text>
                  </Stack>
                </Link>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={12} align="center">
            <Link
              href="/cart"
              borderBottom="none"
              _hover={{ transform: "scale(1.05)" }}
              {...(router.asPath.includes("/cart")
                ? { textDecoration: "underline" }
                : { color: "#000" })}
            >
              <Stack direction="row" spacing={3} align="center">
                <Box pos="relative">
                  <Bag2 set="light" />
                  {!cartStore.loadingCart && (
                    <Center
                      boxSize="20px"
                      pos="absolute"
                      top="-5px"
                      left="12px"
                      bgColor="#000"
                      color="#fff"
                      rounded="50%"
                      p={2}
                    >
                      <Text fontSize="xs" lineHeight="1" color="inherit">
                        {cartStore?.totalInCart}
                      </Text>
                    </Center>
                  )}
                </Box>

                <Text
                  color="rgb(0 0 0 / 68%)"
                  fontSize="inherit"
                  fontWeight="600"
                >
                  Cart
                </Text>
              </Stack>
            </Link>
          </Stack>
        </chakra.nav>

        {/* mobile topbar */}
        <chakra.header
          gridArea="topbar"
          pos="fixed"
          top="0"
          w="100%"
          bg="#fff"
          color="#000"
          borderBottom="1px solid rgba(0, 0, 0, 0.08)"
          px={5}
          py={5}
          zIndex="2"
          display={{ base: "block", md: "none" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justify="space-between"
            h="100%"
            w="100%"
          >
            <Link
              href="/"
              borderBottom="none"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Heading fontWeight="800" fontSize="xl">
                {router.query.store}
              </Heading>
            </Link>
          </Stack>
        </chakra.header>

        <chakra.main gridArea="main">{children}</chakra.main>

        {/* mobile bottombar */}
        <chakra.nav
          gridArea="bottombar"
          bg="#fff"
          color="#000"
          borderTop="1px solid rgba(0, 0, 0, 0.08)"
          pos="fixed"
          zIndex="2"
          bottom="0"
          h="4.938rem"
          w="100%"
          display={{ base: "block", md: "none" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justify="space-around"
            h="100%"
            w="100%"
          >
            {navLinks.map((NavLink, idx) => (
              <Link
                key={idx}
                href={`${NavLink.url}`}
                borderBottom="none"
                {...(NavLink.isActive ? { textDecoration: "underline" } : {})}
              >
                <Stack spacing={2} align="center">
                  <Text
                    fontWeight="normal"
                    color="inherit"
                    fontSize="md"
                    as="span"
                  >
                    {NavLink.name}
                  </Text>
                </Stack>
              </Link>
            ))}
            <Stack>
              <Link
                href="/cart"
                borderBottom="none"
                _hover={{ transform: "scale(1.05)" }}
                {...(router.asPath.includes("/cart")
                  ? { textDecoration: "underline" }
                  : { color: "#000" })}
              >
                <Stack direction="row" spacing={2} align="center">
                  <Box pos="relative">
                    <Bag2 set="light" />
                    {!cartStore.loadingCart && (
                      <Center
                        boxSize="20px"
                        pos="absolute"
                        top="-5px"
                        left="12px"
                        bgColor="#000"
                        color="#fff"
                        rounded="50%"
                        p={2}
                      >
                        <Text fontSize="xs" lineHeight="1" color="inherit">
                          {cartStore?.totalInCart}
                        </Text>
                      </Center>
                    )}
                  </Box>
                  <Text color="inherit" fontSize="inherit" fontWeight="600">
                    Cart
                  </Text>
                </Stack>
              </Link>
            </Stack>
          </Stack>
        </chakra.nav>
      </Grid>
    </CartContext.Provider>
  );
};

export default CustomerLayout;