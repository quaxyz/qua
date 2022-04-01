import { Button } from "@chakra-ui/button";
import {
  Box,
  chakra,
  Container,
  Heading,
  Image,
  Stack,
  Input,
  Text,
  Link,
  VStack,
  Spacer,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FormGroup } from "components/form-group";
import { Wallet } from "components/wallet";
import { Search } from "react-iconly";

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
          px={{ base: "5", md: "24" }}
          py={{ base: "2", md: "8" }}
          bgColor="rgba(255, 255, 255, 98%)"
          backdropFilter="blur(24px)"
          maxW="100%"
          h="72px"
          pos="absolute"
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
                  alt="Qua logo"
                  layout="fixed"
                  width={{ base: "5.75rem", md: "3.75rem" }}
                  height={{ base: "5.75rem", md: "3.75rem" }}
                />
              </Box>
            </a>
          </NextLink>

          <NextLink href="/setup" passHref>
            <Link>Start selling</Link>
          </NextLink>
        </Stack>
      </chakra.nav>

      <Container
        maxW="100%"
        h={{ base: "50vh", md: "58vh" }}
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
        bgImage="url(/images/header.png)"
        position="relative"
      >
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          px={{ base: "2", md: "24" }}
          pt={{ base: "8rem", md: "12rem" }}
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
                fontSize={{ base: "32px", md: "48px" }}
                mb={{ base: "2", md: "4" }}
              >
                Welcome to Qua.
              </Heading>
              <Text
                as="h1"
                fontSize={{ base: "16px", md: "17px" }}
                color="#fff"
                opacity="0.87"
              >
                The online mall for indie brands, ecommerce, retail and
                shopping.
              </Text>
            </Stack>

            <Stack direction="row" spacing="4">
              <NextLink href="/setup" passHref>
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

              <NextLink href="/setup" passHref>
                <Button
                  display={{ base: "flex", md: "none" }}
                  as={Link}
                  variant="solid-outline"
                  size="md"
                  m="0 !important"
                  bgColor="#fff"
                  border="none"
                  color="#000"
                >
                  Get Started
                </Button>
              </NextLink>

              <NextLink href="/stores" passHref>
                <Button
                  as={Link}
                  display={{ base: "none", md: "flex" }}
                  variant="solid-outline"
                  size="lg"
                  color="#fff"
                  borderColor="#fff"
                >
                  Go Shopping
                </Button>
              </NextLink>
              <NextLink href="/stores" passHref>
                <Button
                  display={{ base: "flex", md: "none" }}
                  as={Link}
                  variant="solid-outline"
                  size="md"
                  color="#fff"
                  borderColor="#fff"
                >
                  Go Shopping
                </Button>
              </NextLink>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Container maxW="100%" py={{ base: "0", md: "16" }}>
        <Stack spacing="4">
          <Stack
            direction={{ base: "column", md: "row" }}
            px={{ base: "2", md: "24" }}
            h="536px"
            spacing="4"
          >
            <Stack
              p="12"
              w="100%"
              align="center"
              bg="#FAFAFA"
              // rounded="8px"
              h="100%"
              spacing="12"
            >
              <Heading
                color="#1D1D1F"
                fontWeight="600"
                fontSize={{ base: "1rem", md: "32px" }}
              >
                Sell Computer & Electronics
              </Heading>
              <chakra.figure
                bgRepeat="no-repeat"
                bgSize="contain"
                bgPosition="center center"
                bgImage="url(/images/electronics.png)"
                width="100%"
                height="100%"
              ></chakra.figure>
            </Stack>

            <Stack
              p="12"
              w="100%"
              align="center"
              bg="#FAFAFA"
              // rounded="8px"
              h="100%"
              spacing="12"
            >
              <Heading
                color="#1D1D1F"
                fontWeight="600"
                fontSize={{ base: "1rem", md: "32px" }}
              >
                Sell Wears & Cosmetics
              </Heading>

              <chakra.figure
                bgRepeat="no-repeat"
                bgSize="contain"
                bgPosition="center center"
                bgImage="url(/images/wears.png)"
                width="100%"
                height="100%"
              ></chakra.figure>
            </Stack>
          </Stack>

          <Stack
            direction={{ base: "column", md: "row" }}
            px={{ base: "2", md: "24" }}
            h="500px"
            spacing="4"
          >
            <Stack
              p="12"
              w={{ base: "100%", md: "1280px" }}
              align="center"
              bg="#FAFAFA"
              // rounded="8px"
              h="100%"
              spacing="12"
            >
              <Heading
                color="#1D1D1F"
                fontWeight="600"
                fontSize={{ base: "1rem", md: "32px" }}
              >
                Sell Edibles & Pharma
              </Heading>
              <chakra.figure
                bgRepeat="no-repeat"
                bgSize="contain"
                bgPosition="center center"
                bgImage="url(/images/edible.png)"
                width="100%"
                height="100%"
              ></chakra.figure>
            </Stack>

            <Stack
              p="12"
              w="100%"
              align="center"
              justify="center"
              bg="#FAFAFA"
              bgRepeat="no-repeat"
              bgSize="cover"
              bgPosition="center center"
              bgImage="linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)),url(/images/highlight.jpg)"
              rounded="8px"
              h="100%"
            >
              <Stack align="center" justify="center" spacing="4">
                <Heading
                  color="#fff"
                  fontWeight="600"
                  fontSize={{ base: "1rem", md: "32px" }}
                >
                  Sell Everything
                </Heading>
                <Stack align="center" spacing="2">
                  <Text
                    textAlign="center"
                    w={{ base: "100%", md: "400px" }}
                    color="#fff"
                  >
                    All you need is one store that delivers the best experience
                    to your customers
                  </Text>
                  <Text fontWeight="300" fontSize="xs" color="#fff">
                    0 competition. 100% customer loyalty.
                  </Text>
                </Stack>
                <NextLink href="/setup" passHref>
                  <Button
                    as={Link}
                    borderBottom="none"
                    variant="primary"
                    size="xs"
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

      <Stack pt="4" borderTop="0.8px solid rgba(0, 0, 0, 0.24)" w="100%" />

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
          py={{ base: "12", md: "10rem" }}
          spacing="2"
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
          <NextLink href="/setup" passHref>
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
              Get Started
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
