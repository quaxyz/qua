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
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";

const WebsiteLayout: React.FC = ({ children }) => {
  return (
    <div>
      <chakra.nav display={{ base: "none", md: "block" }}>
        <Flex align="center" justify="space-between" px="4rem" maxW="100%">
          <NextLink href="/" passHref>
            <Link>
              <Image
                src="/logo.svg"
                alt="Qua logo"
                layout="fixed"
                width={100}
                height={100}
              />
            </Link>
          </NextLink>
          <Tabs colorScheme="#000000">
            <TabList border="none">
              <Tab p="0" mr="8">
                <NextLink href="/" passHref>
                  <Link>Home</Link>
                </NextLink>
              </Tab>

              <Tab p="0">
                <NextLink href="/stores" passHref>
                  <Link>P2P Stores</Link>
                </NextLink>
              </Tab>
            </TabList>
          </Tabs>
          <Wallet
            ButtonProps={{
              variant: "primary",
              color: "#FFF",
              rounded: "8px",
              size: "md",
            }}
          />
        </Flex>
        <hr />
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
