import React from "react";
import {
  Box,
  Button,
  chakra,
  Flex,
  List,
  ListItem,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

const WebsiteLayout: React.FC = ({ children }) => {
  return (
    <div>
      <header>
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
          <Button key="metamask-install" size="md" variant="solid-outline">
            Connect wallet
          </Button>
        </Flex>
        <hr />
      </header>

      <chakra.main>{children}</chakra.main>

      <Box
        maxWidth="100%"
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="#000"
        color="#fff"
        margin="1rem"
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

          <List mx="8">
            <ListItem>
              <Link href="/terms">
                <a>Terms of use</a>
              </Link>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <Link href="/privacy">
                <a>Privacy Policy</a>
              </Link>
            </ListItem>
          </List>
          <List ml="8">
            <ListItem>
              <Link href="/faq">
                <a>FAQ</a>
              </Link>
            </ListItem>
          </List>
        </Box>
      </Box>
    </div>
  );
};

export default WebsiteLayout;
