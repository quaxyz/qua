import React from "react";
import Head from "next/head";
import Link from "components/link";
import useCart from "hooks/useCart";
import _capitalize from "lodash.capitalize";
import {
  Box,
  Button,
  Center,
  chakra,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CartContext } from "contexts/cart";
import { useRouter } from "next/router";
import { Bag2, User } from "react-iconly";
import { AccountMenu } from "components/account";
import { useCustomerData } from "hooks/auth";

const navLinks = [
  {
    name: "Products",
    url: "/",
  },
  {
    name: "About",
    url: "/about",
  },
];

const accountMenuLinks = [
  {
    label: "Account",
    url: `/account`,
  },
  {
    label: "Orders",
    url: `/orders`,
  },
];

const CustomerLayout = ({
  title,
  isLoggedIn,
  isOwner,
  cart,
  children,
}: any) => {
  const router = useRouter();
  const { data } = useCustomerData({
    cart,
    isLoggedIn,
    isOwner,
  });

  const cartStore = useCart(data?.cart, {
    isLoggedIn: data?.isLoggedIn,
  });

  return (
    <CartContext.Provider value={cartStore}>
      <Head>
        <title>
          {title} - {_capitalize((router.query.store as string) || "")}
        </title>
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
                  {...(router.asPath.endsWith(navLink.url)
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
            <AccountMenu
              isLoggedIn={data?.isLoggedIn}
              options={[
                ...(data?.isOwner
                  ? [{ label: "Dashboard", url: "/dashboard" }]
                  : []),
                ...accountMenuLinks,
              ]}
            >
              <Button
                variant="primary"
                colorScheme="black"
                leftIcon={
                  <Icon mr="2" as={(props) => <User set="bold" {...props} />} />
                }
              >
                My Account
              </Button>
            </AccountMenu>

            <Link
              href={`/cart`}
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

            <AccountMenu
              isLoggedIn={data?.isLoggedIn}
              options={[
                ...(data?.isOwner
                  ? [{ label: "Dashboard", url: "/dashboard" }]
                  : []),
                ...accountMenuLinks,
              ]}
            >
              <Button
                variant="outline"
                bg="rgba(0, 0, 0, 0.04)"
                rounded="50px"
                _hover={{ bg: "transparent", borderColor: "rgb(0 0 0 / 12%)" }}
              >
                My Account
              </Button>
            </AccountMenu>
          </Stack>
        </chakra.header>

        <chakra.main gridArea="main">{children}</chakra.main>

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
                {...(router.asPath === `/${router.query?.store}${NavLink.url}`
                  ? { textDecoration: "underline" }
                  : {})}
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
                href={`/cart`}
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
