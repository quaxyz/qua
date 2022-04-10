import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Button,
  chakra,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "components/link";
import { Bag, Category, Graph, User, Show } from "react-iconly";
import { CgMore } from "react-icons/cg";

const useNavLinks = () => {
  const router = useRouter();
  return React.useMemo(() => {
    return [
      {
        name: "Dashboard",
        icon: (props: any) => <Category set="light" {...props} />,
        url: `/${router.query.store}/`,
        isActive: router.asPath === `/${router.query.store}/`,
      },
      {
        name: "Products",
        icon: (props: any) => <Graph set="light" {...props} />,
        url: `/${router.query.store}/products/`,
        isActive: router.asPath?.includes("products"),
      },
      {
        name: "Orders",
        icon: (props: any) => <Bag set="light" {...props} />,
        url: `/${router.query.store}/orders/`,
        isActive: router.asPath?.includes("orders"),
      },
    ];
  }, [router]);
};

const DashboardLayout = ({ title, children }: any) => {
  const router = useRouter();
  const navLinks = useNavLinks();

  const publicStorePath = React.useMemo(() => {
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${proto}://${router.query.store}.${process.env.NEXT_PUBLIC_DOMAIN}`;
  }, [router.query.store]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Grid
        templateColumns="280px 1fr"
        templateRows="70px 1fr 70px"
        templateAreas={{
          base: `"topbar topbar" "main main" "bottombar bottombar"`,
          md: `"topbar topbar"
          "sidebar main "
          "sidebar main "`,
        }}
        minH="100vh"
      >
        {/* topbar */}
        <chakra.nav
          gridArea="topbar"
          display={{ base: "none", md: "flex" }}
          borderBottom="1px solid rgba(19, 20, 21, 0.08)"
          pos="fixed"
          top="0"
          left="0"
          right="0"
          bg="#fff"
          zIndex="2"
          h="70px"
        >
          <Stack
            w="100%"
            px={12}
            direction="row"
            align="center"
            justify="space-between"
          >
            <Stack
              as={Link}
              href={publicStorePath}
              direction="row"
              border="none"
              align="center"
              spacing={2}
            >
              <Heading
                textTransform="capitalize"
                fontWeight="800"
                fontSize="22px"
                color="#000"
              >
                {router.query?.store}
              </Heading>
              <Icon
                fontSize="22"
                color="#131415"
                opacity="80%"
                as={(props) => <Show set="bold" {...props} />}
              />
            </Stack>

            <Button
              variant="outline"
              size="sm"
              fontSize="15px"
              bg="rgba(19, 20, 21, 0.04)"
              borderRadius="12px"
              border="1px solid rgba(19, 20, 21, 0.08)"
              leftIcon={
                <Icon mr="2" as={(props) => <User set="bold" {...props} />} />
              }
              as={Link}
              href={`/${router.query.store}/settings`}
            >
              My Account
            </Button>
          </Stack>
        </chakra.nav>

        {/* sidebar */}
        <chakra.aside
          gridArea="sidebar"
          py={8}
          display={{ base: "none", md: "block" }}
          bg=" rgba(19, 20, 21, 0.02)"
          borderRight="1px solid rgba(19, 20, 21, 0.08)"
          position="relative"
        >
          <Stack spacing={8} px={10} pos="fixed" left="0" minH="100%">
            <Stack spacing={6}>
              {navLinks.map((navLink, idx) => (
                <Link
                  key={idx}
                  href={navLink.url}
                  px={4}
                  py={3}
                  rounded="8px"
                  borderBottom="none"
                  _hover={{ transform: "scale(1.02)" }}
                  {...(navLink.isActive
                    ? { color: "#fff", bg: "#000" }
                    : { color: "#000" })}
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
          </Stack>
        </chakra.aside>

        {/* mobile topbar */}
        <chakra.header
          gridArea="topbar"
          borderBottom="1px solid rgba(19, 20, 21, 0.08)"
          bg="#fff"
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
            <Stack
              as={Link}
              href="/"
              direction="row"
              border="none"
              align="center"
              spacing={2}
            >
              <Heading
                textTransform="capitalize"
                fontWeight="800"
                fontSize="lg"
                color="#000"
              >
                {router.query?.store}
              </Heading>
              <Icon
                fontSize="22"
                color="#131415"
                opacity="80%"
                as={(props) => <Show set="bold" {...props} />}
              />
            </Stack>

            <Button
              variant="outline"
              rounded="8px"
              size="sm"
              borderColor="rgb(255 255 255 / 16%)"
              rightIcon={<Icon as={CgMore} />}
              as={Link}
              href={`/${router.query.store}/settings`}
              color="#131415"
              _hover={{
                bg: "transparent",
                borderColor: "rgb(255 255 255 / 48%)",
              }}
            >
              My Account
            </Button>
          </Stack>
        </chakra.header>

        {/* main */}
        <chakra.main gridArea="main">{children}</chakra.main>

        {/* mobile bottom */}
        <chakra.aside
          gridArea="bottombar"
          bg="#000000"
          pos="fixed"
          bottom="0"
          h="4.938rem"
          w="100%"
          display={{ base: "block", md: "none" }}
          zIndex="1"
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
                href={NavLink.url}
                borderBottom="none"
                color="#FFF"
                {...(NavLink.isActive ? { textDecoration: "underline" } : {})}
              >
                <Stack spacing={2} align="center">
                  <Icon
                    boxSize={5}
                    as={(props) => (
                      <NavLink.icon
                        {...(NavLink.isActive ? { set: "bold" } : {})}
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
