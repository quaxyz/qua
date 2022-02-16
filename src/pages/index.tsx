import { Button } from "@chakra-ui/button";
import {
  Box,
  chakra,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  Link,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Wallet } from "components/wallet";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Qua | Decentralized eCommerce</title>
      </Head>

      <chakra.nav position="relative">
        <Stack
          align="center"
          direction="row"
          justify="space-between"
          px={{ base: "4", md: "8rem" }}
          py={{ base: "4", md: "8" }}
          maxW="100%"
          pos="absolute"
          top="0"
          left="0"
          right="0"
          zIndex="2"
        >
          <NextLink href="/" passHref>
            <a>
              <Box pl={{ base: "0", md: "4rem" }}>
                <Image
                  src="/svg/qua_mark_black.svg"
                  alt="Qua logo"
                  layout="fixed"
                  width={{ base: "3.75rem", md: "4.375rem" }}
                  height={{ base: "3.75rem", md: "4.375rem" }}
                />
              </Box>
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

      <Container
        maxW="100%"
        h={{ base: "100%", md: "100vh" }}
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="-4rem -5rem"
        bgImage="url(/bg.svg)"
        position="relative"
      >
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          pl={{ base: "2", md: "8rem" }}
          pr={{ base: "2", md: "5rem" }}
          pb={{ base: "4rem", md: "16rem" }}
          pt={{ base: "7rem", md: "12rem" }}
          w="100%"
          spacing="0.6rem"
        >
          <Stack w="100%" pl={{ base: "0", md: "4rem" }}>
            <Stack maxW={{ base: "100%", md: "48rem" }} mb="8">
              <Heading
                color="#131415"
                fontWeight="800"
                fontSize={{ base: "1.8rem", md: "64" }}
                mb="4"
              >
                Decentralizing the world of eCommerce
              </Heading>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                color="#131415"
                opacity="0.72"
              >
                {/* Qua makes it easy for brands and customers to trade online. */}
                Qua enables peer-to-peer trade between buyers and sellers.
                {/* Qua is the easiest place for brands and customers to do trade
                online. */}
              </Text>
            </Stack>

            <Stack
              direction={{ base: "column", md: "row" }}
              w="100%"
              align={{ base: "left", md: "center" }}
              spacing="4"
            >
              <NextLink href="/setup" passHref>
                <Button as={Link} size="lg">
                  Setup my store
                </Button>
              </NextLink>
              <NextLink href="/stores" passHref>
                <Button as={Link} variant="solid-outline" size="lg">
                  Go Shopping
                </Button>
              </NextLink>
            </Stack>
          </Stack>

          <Stack
            align="center"
            justify="center"
            spacing="12"
            position="relative"
            left="1rem"
          >
            <Stack
              h={{ base: "80px", md: "100" }}
              w="0.8px"
              bgColor="rgba(0, 0, 0, 0.24)"
            />
            <VStack spacing="8">
              <Link
                href="https://www.instagram.com/qua_xyz/"
                color="#000"
                textTransform="uppercase"
                fontSize="xs"
                // transformOrigin="0 0"
                transform="rotate(90deg)"
                borderBottom="none"
                isExternal
              >
                Instagram
              </Link>{" "}
              <Spacer mx="2" />
              <Link
                href="https://discord.gg/nK8Vgae2W8"
                color="#000"
                textTransform="uppercase"
                fontSize="xs"
                transform="rotate(90deg)"
                borderBottom="none"
                isExternal
              >
                Discord
              </Link>{" "}
              <Spacer mx="2" />
              <Link
                href="https://twitter.com/qua_xyz"
                color="#000"
                textTransform="uppercase"
                fontSize="xs"
                transform="rotate(90deg)"
                borderBottom="none"
                isExternal
              >
                Twitter
              </Link>
            </VStack>
            <Stack
              h={{ base: "80px", md: "100" }}
              w="0.8px"
              bgColor="rgba(0, 0, 0, 0.24)"
            />
          </Stack>
        </Stack>

        <Stack
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justify="space-between"
          spacing={{ base: "0", md: "16" }}
          w="100%"
          px={{ base: "4", md: "12rem" }}
        >
          <Stack direction="row" spacing="12">
            <NextLink href="/about" passHref>
              <Link fontWeight="normal" color="inherit" fontSize="sm" as="span">
                About Qua
              </Link>
            </NextLink>

            <NextLink href="/stores" passHref>
              <Link fontWeight="normal" color="inherit" fontSize="sm" as="span">
                P2P Stores
              </Link>
            </NextLink>
          </Stack>

          <Text
            display={{ base: "none", md: "block" }}
            fontFamily="Darker Grotesque"
            fontSize="24px"
            fontWeight="600"
            lineHeight="24px"
          >
            Qua is Permissionless.
            <br />
            Censorship-resistant.
          </Text>
        </Stack>
      </Container>
    </>
  );
};

export default Home;
