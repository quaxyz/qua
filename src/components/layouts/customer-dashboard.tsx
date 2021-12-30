import {
  chakra,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Wallet } from "components/wallet";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { CgMore } from "react-icons/cg";

const navLinks = [
  {
    name: "Products",
    url: "",
  },
  {
    name: "About",
    url: "/about",
  },
];

const CustomerLayout = ({ title, children }: any) => {
  const router = useRouter();
  const { account } = useWeb3React();

  return (
    <>
      <Head>
        <title>{title} - Frowth</title>
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
            <NextLink href={`/${router?.query.store}`} passHref>
              <Link borderBottom="none" _hover={{ transform: "scale(1.05)" }}>
                <Heading fontWeight="800" fontSize="2xl" px={3}>
                  {router.query.store}
                </Heading>
              </Link>
            </NextLink>

            <Stack direction="row" spacing={8}>
              {navLinks.map((navLink, idx) => (
                <NextLink
                  key={idx}
                  href={`/${router.query?.store}${navLink.url}`}
                  passHref
                >
                  <Link
                    borderBottom="none"
                    _hover={{ transform: "scale(1.05)" }}
                    {...(router.asPath ===
                    `/${router.query?.store}${navLink.url}`
                      ? { textDecoration: "underline" }
                      : { color: "#000" })}
                  >
                    <Stack direction="row" spacing={4} align="center">
                      <Text color="inherit" fontSize="inherit" fontWeight="600">
                        {navLink.name}
                      </Text>
                    </Stack>
                  </Link>
                </NextLink>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={12} align="center">
            <Wallet
              ButtonProps={{
                variant: "primary",
                leftIcon: account ? <Icon as={CgMore} mr={2} /> : undefined,
              }}
            />
            <NextLink href={`/${router?.query.store}/cart/`} passHref>
              <Link
                borderBottom="none"
                _hover={{ transform: "scale(1.05)" }}
                {...(router.asPath.includes("/cart")
                  ? { textDecoration: "underline" }
                  : { color: "#000" })}
              >
                <Stack direction="row" spacing={4} align="center">
                  <Text color="inherit" fontSize="inherit" fontWeight="600">
                    Cart
                  </Text>
                </Stack>
              </Link>
            </NextLink>
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
            <NextLink href={`/${router?.query.store}`} passHref>
              <Link borderBottom="none" _hover={{ transform: "scale(1.05)" }}>
                <Heading fontWeight="800" fontSize="xl">
                  {router.query.store}
                </Heading>
              </Link>
            </NextLink>

            <Wallet
              ButtonProps={{
                variant: "outline",
                bg: " rgba(0, 0, 0, 0.04)",
                rounded: "50px",
                leftIcon: account ? <Icon as={CgMore} mr={0} /> : undefined,
                _hover: {
                  bg: "transparent",
                  borderColor: "rgb(0 0 0 / 12%)",
                },
              }}
            />
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
              <NextLink
                key={idx}
                href={`/${router.query?.store}${NavLink.url}`}
                passHref
              >
                <Link
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
              </NextLink>
            ))}
            <Stack>
              <NextLink href={`/${router?.query.store}/cart/`} passHref>
                <Link
                  borderBottom="none"
                  _hover={{ transform: "scale(1.05)" }}
                  {...(router.asPath.includes("/cart")
                    ? { textDecoration: "underline" }
                    : { color: "#000" })}
                >
                  <Stack direction="row" spacing={4} align="center">
                    <Text color="inherit" fontSize="inherit" fontWeight="600">
                      Cart
                    </Text>
                  </Stack>
                </Link>
              </NextLink>
            </Stack>
          </Stack>
        </chakra.nav>
      </Grid>
    </>
  );
};

export default CustomerLayout;
