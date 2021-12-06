import React from "react";
import NextLink from "next/link";
import { chakra, Grid, Heading, Stack, Link, Icon, Text } from "@chakra-ui/react";
import { Category, Graph, Bag } from "react-iconly";
import { CgMore } from "react-icons/cg";
import { useRouter } from "next/router";
import { Wallet } from "components/wallet";

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

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter();
  return (
    <Grid templateColumns="240px 1fr" minH="100vh">
      <chakra.aside bg="#000000" px={4} py={8}>
        <Stack spacing={8} minH="100%">
          <Heading fontSize="2xl" color="#fff" px={3}>
            Frowth
          </Heading>

          <Stack spacing={6}>
            {navLinks.map((navLink, idx) => (
              <NextLink key={idx} href={navLink.url} passHref>
                <Link
                  px={3}
                  py={2}
                  rounded="4px"
                  borderBottom="none"
                  _hover={{ transform: "scale(1.05)" }}
                  {...(router.asPath.includes(navLink.url) ? { color: "#000", bg: "#FFF" } : { color: "#FFF" })}
                >
                  <Stack direction="row" spacing={2} align="center">
                    <Icon boxSize={5} as={navLink.icon} />
                    <Text fontWeight="normal" color="inherit" fontSize="inherit" as="span">
                      {navLink.name}
                    </Text>
                  </Stack>
                </Link>
              </NextLink>
            ))}
          </Stack>

          <Wallet
            ButtonProps={{
              variant: "outline",
              mt: "auto !important",
              color: "#FFF",
              rounded: "8px",
              borderColor: "rgb(255 255 255 / 16%)",
              leftIcon: <Icon as={CgMore} mr={3} />,
              _hover: { bg: "transparent", borderColor: "rgb(255 255 255 / 48%)" },
            }}
          />
        </Stack>
      </chakra.aside>

      <chakra.main>{children}</chakra.main>
    </Grid>
  );
};

export default DashboardLayout;
