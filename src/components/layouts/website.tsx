import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import {
  Box,
  chakra,
  Flex,
  List,
  Link,
  ListItem,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";
import { useRouter } from "next/router";

const WebsiteLayout: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <div>
      <chakra.nav
        display={{ base: "none", md: "block" }}
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
      >
        <Stack
          align="center"
          direction="row"
          justify="space-between"
          px="4rem"
          maxW="100%"
        >
          <NextLink href="/" passHref>
            <a>
              <Image
                src="/logo.svg"
                alt="Qua logo"
                layout="fixed"
                width={100}
                height={100}
              />
            </a>
          </NextLink>

          <Stack direction="row" align="center" spacing="8">
            <NextLink href="/" passHref>
              <Link
                borderBottom="none"
                _hover={{ transform: "scale(1.05)" }}
                {...(router.asPath.includes("/")
                  ? { textDecoration: "underline" }
                  : { color: "#000" })}
              >
                Home
              </Link>
            </NextLink>

            <NextLink href="/stores" passHref>
              <Link
                borderBottom="none"
                _hover={{ transform: "scale(1.05)" }}
                {...(router.asPath.includes("/stores")
                  ? { textDecoration: "underline" }
                  : { color: "#000" })}
              >
                P2P Stores
              </Link>
            </NextLink>
          </Stack>

          <Wallet
            ButtonProps={{
              variant: "primary",
              color: "#FFF",
              rounded: "8px",
              size: "md",
            }}
          />
        </Stack>
      </chakra.nav>

      <chakra.nav
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
        display={{ base: "block", md: "none" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justify="space-between"
          h="100%"
          w="100%"
          px={4}
        >
          <NextLink href="/" passHref>
            <Link>
              <Image
                src="/logo.svg"
                alt="Qua logo"
                layout="fixed"
                width={80}
                height={80}
              />
            </Link>
          </NextLink>

          <Wallet
            ButtonProps={{
              variant: "primary",
              color: "#FFF",
              rounded: "8px",
              size: "md",
            }}
          />
        </Stack>
      </chakra.nav>

      <chakra.main>{children}</chakra.main>

      <chakra.footer
        maxWidth="100%"
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="#000"
        color="#fff"
        margin={{ base: "0.5rem 0.5rem 5.5rem 0.5rem", md: "1rem" }}
      >
        <Image
          src="/qua-mark-white.svg"
          alt="Qua Mark"
          layout="fixed"
          width={150}
          height={150}
        />

        <Box
          display="flex"
          p="4rem"
          position="absolute"
          bottom="0"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <List>
            <ListItem>
              <NextLink href="/about" passHref>
                <Link>About qua</Link>
              </NextLink>
            </ListItem>
          </List>
        </Box>
      </chakra.footer>

      <chakra.nav
        bg="#fff"
        borderTop="1px solid rgba(0, 0, 0, 0.08)"
        pos="fixed"
        bottom="0"
        h="4.938rem"
        w="100%"
        display={{ base: "block", md: "none" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justify="center"
          spacing="16"
          h="100%"
          w="100%"
        >
          <NextLink href="/" passHref>
            <Link fontWeight="normal" color="inherit" fontSize="lg" as="span">
              Home
            </Link>
          </NextLink>

          <NextLink href="/stores" passHref>
            <Link fontWeight="normal" color="inherit" fontSize="lg" as="span">
              P2P Stores
            </Link>
          </NextLink>
        </Stack>
      </chakra.nav>
    </div>
  );
};

export default WebsiteLayout;
