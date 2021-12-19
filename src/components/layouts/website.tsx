import {
  Box,
  chakra,
  Flex,
  List,
  ListItem,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";
import Image from "next/image";
import { default as Link, default as NextLink } from "next/link";
import React from "react";

const WebsiteLayout: React.FC = ({ children }) => {
  return (
    <div>
      <chakra.nav display={{ base: "none", md: "block" }}>
        <Flex align="center" justify="space-between" px="4rem" maxW="100%">
          <Link href="/">
            <a>
              <Image
                src="/logo.svg"
                alt="Qua logo"
                layout="fixed"
                width={100}
                height={100}
              />
            </a>
          </Link>
          <Tabs colorScheme="#000000">
            <TabList border="none">
              <Tab p="0" mr="8">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </Tab>

              <Tab p="0">
                <Link href="/stores">
                  <a>P2P Stores</a>
                </Link>
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
          <Link href="/">
            <a>
              <Image
                src="/logo.svg"
                alt="Qua logo"
                layout="fixed"
                width={80}
                height={80}
              />
            </a>
          </Link>

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
              <Link href="/about">
                <a>About qua</a>
              </Link>
            </ListItem>
          </List>

          {/* <List mx="8">
            <ListItem>
              <Link href="/terms">
                <a>Terms of use</a>
              </Link>
            </ListItem>
          </List> */}
          {/* <List>
            <ListItem>
              <Link href="/privacy">
                <a>Privacy Policy</a>
              </Link>
            </ListItem>
          </List> */}
          {/* <List ml="8">
            <ListItem>
              <Link href="/faq">
                <a>FAQ</a>
              </Link>
            </ListItem>
          </List> */}
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
            <Link>
              <Text fontWeight="normal" color="inherit" fontSize="lg" as="span">
                Home
              </Text>
            </Link>
          </NextLink>
          <NextLink href="/stores" passHref>
            <Link>
              <Text fontWeight="normal" color="inherit" fontSize="lg" as="span">
                P2P Stores
              </Text>
            </Link>
          </NextLink>
        </Stack>
      </chakra.nav>
    </div>
  );
};

export default WebsiteLayout;
