import {
  chakra,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";
import { AuthContext } from "libs/auth";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { CgMore } from "react-icons/cg";

const navLinks = [
  {
    name: "Products",
    url: "/products",
  },
  {
    name: "About",
    url: "/about",
  },
];

const CustomerLayout = ({ title, children }: any) => {
  const router = useRouter();

  return (
    <AuthContext.Provider value={null}>
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
            <NextLink href={`/${router?.query.store}/products/`} passHref>
              <Link borderBottom="none" _hover={{ transform: "scale(1.05)" }}>
                <Heading fontWeight="800" fontSize="2xl" px={3}>
                  shooshow
                </Heading>
              </Link>
            </NextLink>

            <Stack direction="row" spacing={8}>
              {navLinks.map((navLink, idx) => (
                <NextLink
                  key={idx}
                  href={`/${router.query?.store}/${navLink.url}`}
                  passHref
                >
                  <Link
                    borderBottom="none"
                    _hover={{ transform: "scale(1.05)" }}
                    {...(router.asPath.includes(navLink.url)
                      ? { textDecoration: "underline" }
                      : { color: "#000" })}
                  >
                    <Stack direction="row" spacing={4} align="center">
                      {/* <Icon boxSize={5} as={navLink.icon} /> */}
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
                variant: "outline",
                bg: " rgba(0, 0, 0, 0.04)",
                rounded: "50px",
                leftIcon: <Icon as={CgMore} mr={2} />,
                _hover: {
                  bg: "transparent",
                  borderColor: "rgb(0 0 0 / 12%)",
                },
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
            <NextLink href={`/${router?.query.store}/products/`} passHref>
              <Link borderBottom="none" _hover={{ transform: "scale(1.05)" }}>
                <Heading fontWeight="800" fontSize="xl">
                  shooshow
                </Heading>
              </Link>
            </NextLink>

            <Wallet
              ButtonProps={{
                variant: "outline",
                bg: " rgba(0, 0, 0, 0.04)",
                rounded: "50px",
                leftIcon: <Icon as={CgMore} mr={0} />,
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
                href={`/${router.query?.store}/${NavLink.url}`}
                passHref
              >
                <Link
                  borderBottom="none"
                  {...(router.asPath.includes(NavLink.url)
                    ? { textDecoration: "underline" }
                    : {})}
                >
                  <Stack spacing={2} align="center">
                    {/* <Icon
                      boxSize={5}
                      as={(props) => (
                        <NavLink.icon
                          {...(router.asPath.includes(NavLink.url)
                            ? { set: "bold" }
                            : {})}
                          {...props}
                        />
                      )}
                    /> */}
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
    </AuthContext.Provider>
  );
};

export default CustomerLayout;
