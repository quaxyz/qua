import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import {
  Box,
  chakra,
  List,
  Link,
  ListItem,
  Stack,
  Heading,
  Button,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";
import { useRouter } from "next/router";
import base from "@emotion/styled/types/base";

const WebsiteLayout: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <chakra.nav
        display={{ base: "none", md: "block" }}
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
        position="relative"
      >
        <Stack
          align="center"
          direction="row"
          justify="space-between"
          px="8rem"
          py="2"
          maxW="100%"
          // pos="absolute"
          // top="0"
          // left="0"
          // right="0"
          // zIndex="2"
        >
          <NextLink href="/" passHref>
            <a>
              <Box>
                <Image
                  src="/svg/qua_mark_black.svg"
                  alt="Qua logo"
                  layout="fixed"
                  width={60}
                  height={60}
                />
              </Box>
            </a>
          </NextLink>

          <Stack>
            <NextLink href="/" passHref>
              <Link>Log in</Link>
            </NextLink>
            <NextLink href="/" passHref>
              <Link>Register</Link>
            </NextLink>
          </Stack>
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
            <a>
              <Image
                src="/svg/qua_mark_black.svg"
                alt="Qua logo"
                layout="fixed"
                width={60}
                height={60}
              />
            </a>
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
        bgImage="radial-gradient(120.68% 530.23% at 80.3% -12.06%, rgba(253, 118, 203, 0.8) 25.18%, rgba(255, 172, 48, 0.8) 100%),url('/images/cta_bg.png')"
        bgPosition="center center"
        bgRepeat="no-repeat"
        bgSize="cover"
        maxWidth="100%"
        display="flex"
        alignItems="center"
        height="600px"
        px={{ base: "0", md: "48" }}
        margin={{ base: "0.5rem 0.5rem 5.5rem 0.5rem", md: "1rem" }}
        boxShadow="0px 10px 180px 10px rgba(253, 118, 203, 0.32)"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          w="100%"
          h="auto"
        >
          <Stack w="100%" px={{ base: "8", md: "0" }}>
            <Stack pt={{ base: "8", md: "4" }} spacing={{ base: "0", md: "0" }}>
              <Text color="#000" fontSize="2xl" fontWeight="400">
                The future of{" "}
              </Text>
              <Heading
                fontFamily="Darker Grotesque"
                fontSize={{ base: "32px", md: "48px" }}
                color="#000"
              >
                eCommerce It P2P!
              </Heading>
            </Stack>

            <Stack
              py={{ base: "4", md: "12" }}
              spacing={{ base: "4", md: "4" }}
            >
              <Stack direction={{ base: "column", md: "row" }}>
                <NextLink href="/setup" passHref>
                  <Button
                    as={Link}
                    w={{ base: "100%", md: "15.5rem" }}
                    variant="solid"
                    bgColor="#fff"
                    color="#000"
                    size="lg"
                    _hover={{ bgColor: "#fff" }}
                  >
                    Get Started
                  </Button>
                </NextLink>
                <NextLink href="/stores" passHref>
                  <Button
                    as={Link}
                    w={{ base: "100%", md: "15.5rem" }}
                    variant="solid-outline"
                    size="lg"
                    textDecoration="2px underline"
                    border="1px solid #000000"
                    color="#000"
                  >
                    Go shopping
                  </Button>
                </NextLink>
              </Stack>
            </Stack>
          </Stack>

          <Stack justify="space-between" spacing={{ base: "8", md: "16" }}>
            <Image
              src="/svg/qua_mark_white.svg"
              alt="Qua Mark"
              layout="fixed"
              width={150}
              height={150}
            />

            <Stack h="100%" alignItems="center" justifyContent="center">
              <List>
                <ListItem>
                  <NextLink href="/about" passHref>
                    <Link>About qua</Link>
                  </NextLink>
                </ListItem>
              </List>
            </Stack>
          </Stack>
        </Stack>
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
    </>
  );
};

export default WebsiteLayout;
