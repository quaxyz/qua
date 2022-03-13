import React from "react";
import Head from "next/head";
import _capitalize from "lodash.capitalize";
import { useRouter } from "next/router";
import {
  Button,
  chakra,
  CircularProgress,
  Container,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "components/link";
import { Wallet } from "components/wallet";
import { useStoreUser } from "hooks/auth";
import { Bag, Category, Graph } from "react-iconly";
import { CgMore } from "react-icons/cg";
import { useGetLink } from "hooks/utils";

const navLinks = [
  {
    name: "Dashboard",
    icon: (props: any) => <Category set="light" {...props} />,
    url: "/",
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
    href: `/dashboard/settings`,
  },
];

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
        You are not logged in as the owner of this store
      </Text>

      <Stack direction="row" spacing={4}>
        <Link fontSize="sm" href="/dashboard/login">
          Login
        </Link>

        <Text fontSize="sm">Or</Text>

        <Link fontSize="sm" href="/">
          Go back to products
        </Link>
      </Stack>
    </Container>
  </Stack>
);

const DashboardLayout = ({ title, children }: any) => {
  const getLink = useGetLink();
  const router = useRouter();

  // handle auth session here
  const storeUser = useStoreUser();

  return (
    <>
      <Head>
        <title>
          {title} - {_capitalize((router.query.store as string) || "")}
        </title>
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
            <Heading
              as={Link}
              href="/"
              textTransform="capitalize"
              fontWeight="800"
              fontSize="2xl"
              color="#fff"
              border="none"
              px={3}
            >
              {router.query?.store}
            </Heading>

            <Stack spacing={6}>
              {navLinks.map((navLink, idx) => (
                <Link
                  key={idx}
                  href={`/dashboard${navLink.url}`}
                  px={3}
                  py={3}
                  rounded="4px"
                  borderBottom="none"
                  _hover={{ transform: "scale(1.05)" }}
                  {...(router.asPath.endsWith(navLink.url)
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
              ))}
            </Stack>

            <Wallet
              menuOptions={walletMenuLinks.map((m) => ({
                ...m,
                href: getLink(m.href),
              }))}
              ButtonProps={{
                variant: "outline",
                mt: "auto !important",

                rounded: "8px",
                borderColor: "rgb(255 255 255 / 16%)",
                leftIcon: <Icon as={CgMore} mr={3} />,
                ...(walletMenuLinks.some((m) => router.asPath.endsWith(m.href))
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
            <Heading
              as={Link}
              href="/"
              fontWeight="800"
              fontSize="xl"
              color="#fff"
              textTransform="uppercase"
              border="none"
            >
              {router.query?.store}
            </Heading>

            <Wallet
              menuOptions={walletMenuLinks.map((m) => ({
                ...m,
                href: getLink(m.href),
              }))}
              ButtonProps={{
                variant: "outline",
                rounded: "8px",
                size: "sm",
                borderColor: "rgb(255 255 255 / 16%)",
                rightIcon: <Icon as={CgMore} />,
                ...(walletMenuLinks.some((m) => router.asPath.endsWith(m.href))
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
          {storeUser.isLoading ? (
            <Stack align="center" justify="center" minH="100%">
              <CircularProgress isIndeterminate color="black" />
            </Stack>
          ) : storeUser.data?.user ? (
            children
          ) : (
            <AuthNotOwner />
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
          zIndex="2"
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
                href={`/dashboard${NavLink.url}`}
                borderBottom="none"
                color="#FFF"
                {...(router.asPath.endsWith(NavLink.url)
                  ? { textDecoration: "underline" }
                  : {})}
              >
                <Stack spacing={2} align="center">
                  <Icon
                    boxSize={5}
                    as={(props) => (
                      <NavLink.icon
                        {...(router.asPath.endsWith(NavLink.url)
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
            ))}
          </Stack>
        </chakra.aside>
      </Grid>
    </>
  );
};

export default DashboardLayout;
