import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home: NextPage = () => {
  const adminPath = React.useMemo(() => {
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${proto}://admin.${process.env.NEXT_PUBLIC_DOMAIN}`;
  }, []);

  return (
    <>
      <Head>
        <title>Qua | Decentralized P2P eCommerce</title>
        <meta
          name="description"
          content="Your unique store link to sell products directly to your customers"
        />
      </Head>

      <chakra.nav position="relative">
        <Stack
          align="center"
          direction="row"
          justify="space-between"
          px={{ base: "4", md: "24" }}
          py={{ base: "2", md: "8" }}
          bgColor="rgba(255, 255, 255, 90%)"
          backdropFilter="blur(24px)"
          maxW="100%"
          h={{ base: "60px", md: "72px" }}
          pos="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="2"
        >
          <NextLink href="/" passHref>
            <a>
              <Box>
                <Image
                  src="/svg/qua_mark_black.svg"
                  boxSize="50"
                  alt="Qua logo"
                />
              </Box>
            </a>
          </NextLink>

          <NextLink href={`${adminPath}/login`} passHref>
            <Link>Login</Link>
          </NextLink>
        </Stack>
      </chakra.nav>

      <Container
        maxW="100%"
        pb={{ base: "3rem", md: "8rem" }}
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="50% 60%"
        bgImage="linear-gradient(0deg, rgba(0, 0, 0, 90%), rgba(0, 0, 0, 80%)), url(/images/highlight.png)"
        bgAttachment="scroll, local"
        position="relative"
      >
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          px={{ base: "4", md: "24" }}
          pt={{ base: "7rem", md: "12rem" }}
          w="100%"
        >
          <Stack w="100%">
            <Stack
              maxW={{ base: "100%", md: "48rem" }}
              mb={{ base: "6", md: "8" }}
            >
              <Heading
                color="#fff"
                as="h2"
                fontWeight="800"
                fontSize={{ base: "28px", md: "48px" }}
                mb="2"
              >
                Welcome to Qua.
              </Heading>
              <Text
                as="h1"
                fontSize={{ base: "16px", md: "17px" }}
                color="#fff"
                opacity="0.87"
              >
                Your unique store link to sell products directly to your
                customers
              </Text>
            </Stack>

            <Stack direction="row" spacing="4">
              <NextLink href={`${adminPath}/setup`} passHref>
                <Button
                  display={{ base: "none", md: "flex" }}
                  as={Link}
                  variant="solid"
                  px="12"
                  size="lg"
                  bgColor="#fff"
                  border="none"
                  color="#000"
                  _hover={{
                    bg: "#fff",
                    color: "#000",
                    transform: "scale(1.02)",
                  }}
                >
                  Get Started
                </Button>
              </NextLink>

              <NextLink href={`${adminPath}/setup`} passHref>
                <Button
                  display={{ base: "flex", md: "none" }}
                  as={Link}
                  variant="solid"
                  px="8"
                  size="lg"
                  m="0 !important"
                  bgColor="#fff"
                  border="none"
                  color="#000"
                  _hover={{
                    bg: "#fff",
                    color: "#000",
                    transform: "scale(1.02)",
                  }}
                >
                  Get Started
                </Button>
              </NextLink>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Container maxW="100%" py={{ base: "12", md: "24" }}>
        <Stack spacing="4">
          <Stack
            direction={{ base: "column", md: "row" }}
            px={{ base: "2", md: "24" }}
            h={{ base: "100%", md: "100%" }}
            spacing={{ base: "2", md: "4" }}
          >
            <Stack
              p={{ base: "8", md: "12" }}
              w="100%"
              align="center"
              bg="#FAFAFA"
              h="100%"
              spacing={{ base: "4", md: "2" }}
            >
              <Stack
                align="center"
                px={{ base: "4", md: "24" }}
                spacing={{ base: "4", md: "6" }}
              >
                <Heading
                  color="#1D1D1F"
                  fontWeight="600"
                  fontSize={{ base: "1.125rem", md: "28px" }}
                  textAlign="center"
                >
                  Businesses
                </Heading>
                <Text
                  color="#000"
                  fontSize={{ base: "13px", md: "1rem" }}
                  fontWeight="400"
                  opacity="72%"
                  textAlign="center"
                >
                  Sell your products online with our easy eCommerce store
                  experience carefully built to work on all devices to help you
                  and your customers achieve your goals fast.
                </Text>
                <NextLink href={`${adminPath}/setup`} passHref>
                  <Button
                    as={Link}
                    borderBottom="none"
                    variant="primary"
                    size="sm"
                    rounded="50px"
                    p="4"
                    bgColor="#000"
                    color="#fff"
                    _hover={{ bgColor: "#000" }}
                    _focus={{ border: "none" }}
                  >
                    Start now
                  </Button>
                </NextLink>
              </Stack>
              <Stack align="center" justify="center" h="100%" w="100%">
                <Image
                  src="/images/business.png"
                  boxSize="100%"
                  objectFit="cover"
                  alt="For Businesses"
                />
              </Stack>
            </Stack>

            <Stack
              p={{ base: "8", md: "12" }}
              w="100%"
              align="center"
              bg="#FAFAFA"
              h="100%"
              spacing={{ base: "4", md: "2" }}
            >
              <Stack
                align="center"
                px={{ base: "4", md: "20" }}
                spacing={{ base: "4", md: "6" }}
              >
                <Heading
                  color="#1D1D1F"
                  fontWeight="600"
                  fontSize={{ base: "1.125rem", md: "28px" }}
                  textAlign="center"
                >
                  Creatives
                </Heading>
                <Text
                  color="#000"
                  fontSize={{ base: "13px", md: "1rem" }}
                  fontWeight="400"
                  opacity="72%"
                  textAlign="center"
                >
                  We refined the experience of starting up an eCommerce store to
                  help you get up and running quickly with a beautiful brand
                  store you can use to monetize your brand conveniently.
                </Text>
                <NextLink href={`${adminPath}/setup`} passHref>
                  <Button
                    as={Link}
                    borderBottom="none"
                    variant="primary"
                    size="sm"
                    rounded="50px"
                    p="4"
                    bgColor="#000"
                    color="#fff"
                    _hover={{ bgColor: "#000" }}
                    _focus={{ border: "none" }}
                  >
                    Start now
                  </Button>
                </NextLink>
              </Stack>

              <Stack align="center" justify="center" h="100%" w="100%">
                <Image
                  src="/images/creative.png"
                  boxSize="100%"
                  objectFit="cover"
                  alt="For Creatives"
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction={{ base: "column", md: "row" }}
            px={{ base: "2", md: "16" }}
            h={{ base: "436px", md: "636px" }}
            spacing={{ base: "4", md: "4" }}
          >
            <Stack
              p="12"
              w="100%"
              align="center"
              justify="center"
              bg="#FAFAFA"
              bgRepeat="no-repeat"
              bgSize="cover"
              bgPosition="center center"
              bgImage="linear-gradient(0deg, rgba(0, 0, 0, 99%), rgba(0, 0, 0, 80%)),url(/images/highlight.png)"
              bgAttachment="fixed"
              rounded="16px"
              h="100%"
            >
              <Stack
                align="center"
                justify="center"
                spacing={{ base: "4", md: "6" }}
              >
                <Heading
                  color="#fff"
                  fontWeight="600"
                  fontSize={{ base: "26px", md: "46px" }}
                  textAlign="center"
                >
                  Sell Your Own Thing.
                </Heading>
                <Stack align="center" spacing="2">
                  <Text
                    textAlign="center"
                    w={{ base: "100%", md: "380px" }}
                    fontSize={{ base: "12px", md: "1.125rem" }}
                    color="#fff"
                  >
                    With one store link that delivers the best experience to
                    your customers
                  </Text>
                  <Text
                    fontWeight="300"
                    fontSize={{ base: "xs", md: "sm" }}
                    color="#fff"
                  >
                    0 competition. 100% customer loyalty.
                  </Text>
                </Stack>
                <NextLink href={`${adminPath}/setup`} passHref>
                  <Button
                    as={Link}
                    borderBottom="none"
                    variant="primary"
                    size="md"
                    rounded="50px"
                    p="4"
                    bgColor="#fff"
                    color="#000"
                    _hover={{ bgColor: "#f2f2f2" }}
                    _focus={{ border: "none" }}
                  >
                    Start Today - Free
                  </Button>
                </NextLink>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Stack pt="4" borderTop="0.8px solid rgba(0, 0, 0, 0.12)" w="100%" />

      <Container
        maxW="100%"
        px={{ base: "2", md: "8" }}
        py={{ base: "0", md: "2" }}
      >
        <Stack
          bgRepeat="no-repeat"
          bgSize="cover"
          bgPosition="center"
          bgImage={{
            base: "url(/images/grow_mobile.png)",
            md: "url(/images/kamran-abdullayev-DvFrRwuyn88-unsplash.jpg)",
          }}
          px={{ base: "6", md: "11rem" }}
          py={{ base: "8rem", md: "15rem" }}
          spacing="2"
          rounded="8"
        >
          <Stack maxW={{ base: "100%", md: "48rem" }} mb="8" spacing="2">
            <Heading
              color="#fff"
              fontWeight="800"
              fontSize={{ base: "1.8rem", md: "64" }}
              mb="4"
            >
              Grow your <br /> business with Qua{" "}
            </Heading>
            <Text
              fontSize={{ base: "15px", md: "18px" }}
              color="#fff"
              opacity="87%"
              w={{ base: "100%", md: "548px" }}
            >
              Set up your brand store in an instant, sell to anyone, anywhere —
              Get the insights to grow with a simple dashboard to manage orders,
              shipping, and payments all in one place.
            </Text>
          </Stack>
          <NextLink href={`${adminPath}/setup`} passHref>
            <Button
              as={Link}
              variant="solid"
              alignSelf="flex-start"
              px="12"
              size="lg"
              bgColor="#fff"
              border="none"
              color="#000"
              _hover={{
                bg: "#fff",
                color: "#000",
                transform: "scale(1.02)",
              }}
            >
              Setup my store
            </Button>
          </NextLink>
        </Stack>
      </Container>

      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "center" }}
        justify="space-between"
        spacing={{ base: "0", md: "16" }}
        w="100%"
        px={{ base: "4", md: "12rem" }}
        py="8"
      >
        <Stack
          direction="row"
          justify="space-between"
          w="100%"
          align="center"
          spacing="12"
        >
          <Stack direction="row" spacing="12">
            <NextLink href="/about" passHref>
              <Link fontWeight="normal" color="inherit" fontSize="xs" as="span">
                About Qua
              </Link>
            </NextLink>
          </Stack>

          <Stack
            display={{ base: "none", md: "flex" }}
            direction="row"
            align="center"
            spacing="12"
          >
            <Stack w="80px" h="1px" bgColor="rgba(0, 0, 0, 0.24)" />
            <Stack direction="row" align="center" spacing="8">
              <Link
                href="https://www.instagram.com/qua_xyz/"
                color="#000"
                textTransform="uppercase"
                fontSize={{ base: "10px", md: "12px" }}
                borderBottom="none"
                isExternal
              >
                Instagram
              </Link>
              <Link
                href="https://discord.gg/nK8Vgae2W8"
                color="#000"
                textTransform="uppercase"
                fontSize={{ base: "10px", md: "12px" }}
                borderBottom="none"
                isExternal
              >
                Discord
              </Link>
              <Link
                href="https://twitter.com/qua_xyz"
                color="#000"
                textTransform="uppercase"
                fontSize={{ base: "10px", md: "12px" }}
                borderBottom="none"
                isExternal
              >
                Twitter
              </Link>
            </Stack>
            <Stack w="80px" h="1px" bgColor="rgba(0, 0, 0, 0.24)" />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Home;
