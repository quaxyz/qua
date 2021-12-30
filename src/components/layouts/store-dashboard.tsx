import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Button,
  chakra,
  CircularProgress,
  Container,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";
import { useInitializeStoreAuth } from "hooks/auth";
import { useCreateSigningKey } from "hooks/signing";
import { AuthContext } from "libs/auth";
import { useRouter } from "next/router";
import { Bag, Category, Graph } from "react-iconly";
import { CgMore } from "react-icons/cg";

const navLinks = [
  {
    name: "Dashboard",
    icon: (props: any) => <Category set="light" {...props} />,
    url: "/dashboard",
  },
  {
    name: "Products",
    icon: (props: any) => <Graph set="light" {...props} />,
    url: "/products",
  },
  {
    name: "Orders",
    icon: (props: any) => <Bag set="light" {...props} />,
    url: "/orders",
  },
];

const walletMenuLinks = [
  {
    label: "Settings",
    href: `/app/settings`,
  },
];

const AuthNoAccount = () => (
  <Stack minH="100%" align="center" justify="center">
    <chakra.div
      pos="absolute"
      top="0"
      left="0"
      h="100vh"
      w="100vw"
      backdropFilter="blur(4px)"
      bg="rgb(0 0 0 / 12%)"
      zIndex="2"
    />

    <Wallet autoOpen closeable={false} />
  </Stack>
);

const AuthNotOwner = () => (
  <Stack minH="100%" align="center" justify="center">
    <chakra.div
      pos="absolute"
      top="0"
      left="0"
      h="100vh"
      w="100vw"
      backdropFilter="blur(4px)"
      bg="rgb(0 0 0 / 12%)"
      zIndex="2"
    />

    <Container maxW="lg" bg="#fff" pos="relative" zIndex="3" px={12} py={12}>
      <Heading fontSize="xl" mb={10}>
        Oops!
      </Heading>

      <Text fontWeight="400" mb={8}>
        Your address does not match the owner of this store
      </Text>

      <Link fontSize="sm" href="/">
        Go back to products
      </Link>
    </Container>
  </Stack>
);

const AuthNoSigningKey = () => {
  const { loading, createSigningKey } = useCreateSigningKey();

  return (
    <Stack minH="100%" align="center" justify="center">
      <chakra.div
        pos="absolute"
        top="0"
        left="0"
        h="100vh"
        w="100vw"
        backdropFilter="blur(4px)"
        bg="rgb(0 0 0 / 12%)"
        zIndex="2"
      />

      <Container maxW="lg" bg="#fff" pos="relative" zIndex="3" px={12} py={12}>
        <Heading fontSize="xl" mb={8}>
          Remember me
        </Heading>

        <Text fontWeight="400" mb={8}>
          Skip approving every interaction with your wallet by allowing Qua to
          remember you.
        </Text>

        <Button
          size="lg"
          variant="solid-outline"
          mb={5}
          onClick={() => createSigningKey()}
          isLoading={loading}
          isFullWidth
        >
          Generate signing key
        </Button>

        <Text textAlign="center" fontSize="sm" fontWeight="600" mb={8}>
          Signing keys can only sign messages and cannot hold funds. They are
          stored securely in the browser database.
        </Text>
      </Container>
    </Stack>
  );
};

const DashboardLayout = ({ title, children }: any) => {
  const router = useRouter();

  // handle auth session here
  const storeAuthData = useInitializeStoreAuth();

  return (
    <AuthContext.Provider value={storeAuthData}>
      <Head>
        <title>{title} - Frowth</title>
      </Head>

      <Grid
        templateColumns="280px 1fr"
        templateRows="70px 1fr 70px"
        templateAreas={{
          base: `"topbar topbar" "main main" "bottombar bottombar"`,
          md: `"sidebar main" "sidebar main" "sidebar main"`,
        }}
        minH="100vh"
      >
        <chakra.aside
          gridArea="sidebar"
          bg="#000000"
          px={6}
          py={8}
          pos="fixed"
          left="0"
          h="100vh"
          w="280px"
          display={{ base: "none", md: "block" }}
        >
          <Stack spacing={8} minH="100%">
            <Heading fontWeight="800" fontSize="2xl" color="#fff" px={3}>
              Frowth
            </Heading>

            <Stack spacing={6}>
              {navLinks.map((navLink, idx) => (
                <NextLink
                  key={idx}
                  href={`/${router.query?.store}/app${navLink.url}`}
                  passHref
                >
                  <Link
                    px={3}
                    py={3}
                    rounded="4px"
                    borderBottom="none"
                    _hover={{ transform: "scale(1.05)" }}
                    {...(router.asPath.includes(navLink.url)
                      ? { color: "#000", bg: "#FFF" }
                      : { color: "#FFF" })}
                  >
                    <Stack direction="row" spacing={4} align="center">
                      <Icon boxSize={5} as={navLink.icon} />
                      <Text
                        fontWeight="normal"
                        color="inherit"
                        fontSize="inherit"
                        as="span"
                      >
                        {navLink.name}
                      </Text>
                    </Stack>
                  </Link>
                </NextLink>
              ))}
            </Stack>

            <Wallet
              menuOptions={walletMenuLinks.map((m) => ({
                ...m,
                href: `/${router.query?.store}${m.href}`,
              }))}
              ButtonProps={{
                variant: "outline",
                mt: "auto !important",

                rounded: "8px",
                borderColor: "rgb(255 255 255 / 16%)",
                leftIcon: <Icon as={CgMore} mr={3} />,
                ...(walletMenuLinks.some((m) => router.asPath.includes(m.href))
                  ? {
                      color: "#000",
                      bg: "#FFF",
                      _hover: { bg: "white" },
                    }
                  : {
                      color: "#FFF",
                      _hover: {
                        bg: "transparent",
                        borderColor: "rgb(255 255 255 / 48%)",
                      },
                    }),
              }}
            />
          </Stack>
        </chakra.aside>

        <chakra.header
          gridArea="topbar"
          bg="#000000"
          px={5}
          display={{ base: "block", md: "none" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justify="space-between"
            h="100%"
            w="100%"
          >
            <Heading fontWeight="800" fontSize="xl" color="#fff">
              Frowth
            </Heading>

            <Wallet
              menuOptions={walletMenuLinks.map((m) => ({
                ...m,
                href: `/${router.query?.store}${m.href}`,
              }))}
              ButtonProps={{
                variant: "outline",
                rounded: "8px",
                size: "sm",
                borderColor: "rgb(255 255 255 / 16%)",
                rightIcon: <Icon as={CgMore} />,
                ...(walletMenuLinks.some((m) => router.asPath.includes(m.href))
                  ? {
                      color: "#000",
                      bg: "#FFF",
                      _hover: { bg: "white" },
                    }
                  : {
                      color: "#FFF",
                      _hover: {
                        bg: "transparent",
                        borderColor: "rgb(255 255 255 / 48%)",
                      },
                    }),
              }}
            />
          </Stack>
        </chakra.header>

        <chakra.main gridArea="main">
          {!storeAuthData.loading ? (
            {
              "": children,
              "no-account": <AuthNoAccount />,
              "not-owner": <AuthNotOwner />,
              "no-signing-key": <AuthNoSigningKey />,
            }[storeAuthData.status]
          ) : (
            <Stack align="center" justify="center" minH="100%">
              <CircularProgress isIndeterminate color="black" />
            </Stack>
          )}
        </chakra.main>

        <chakra.aside
          gridArea="bottombar"
          bg="#000000"
          pos="fixed"
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
                href={`/${router.query?.store}/app${NavLink.url}`}
                passHref
              >
                <Link
                  borderBottom="none"
                  color="#FFF"
                  {...(router.asPath.includes(NavLink.url)
                    ? { textDecoration: "underline" }
                    : {})}
                >
                  <Stack spacing={2} align="center">
                    <Icon
                      boxSize={5}
                      as={(props) => (
                        <NavLink.icon
                          {...(router.asPath.includes(NavLink.url)
                            ? { set: "bold" }
                            : {})}
                          {...props}
                        />
                      )}
                    />
                    <Text
                      fontWeight="normal"
                      color="inherit"
                      fontSize="xs"
                      as="span"
                    >
                      {NavLink.name}
                    </Text>
                  </Stack>
                </Link>
              </NextLink>
            ))}
          </Stack>
        </chakra.aside>
      </Grid>
    </AuthContext.Provider>
  );
};

export default DashboardLayout;
