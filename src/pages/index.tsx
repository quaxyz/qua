import { Button } from "@chakra-ui/button";
import {
  Box,
  chakra,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import WebsiteLayout from "../components/layouts/website";

const Home: NextPage = () => {
  return (
    <WebsiteLayout>
      <Head>
        <title>Home - Qua</title>
      </Head>
      <chakra.header maxW="100%">
        <Box
          bgImage="url('/hedr-bg-home.svg')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize={{ base: "cover", md: "80% 120%" }}
          mt="12"
        >
          <Container maxW="100%" py="20" centerContent>
            <Box maxW={{ base: "100%", md: "48rem" }} mb="8">
              <Heading
                textAlign="center"
                color="#000000"
                size="lg"
                fontSize={{ base: "1.6rem", md: "64" }}
                mb="4"
              >
                Connecting every bussiness to a customer
              </Heading>
              <Text fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
                On the world&apos;s largest P2P ecommerce stores
              </Text>
            </Box>

            <Stack
              display={{ base: "none", md: "flex" }}
              direction="row"
              width="100%"
              justify="center"
              align="center"
              p="4"
            >
              <NextLink href="/stores" passHref>
                <Button variant="solid-outline" size="lg">
                  Go Shopping
                </Button>
              </NextLink>
              <NextLink href="/setup" passHref>
                <Button size="lg">Setup my store</Button>
              </NextLink>
            </Stack>

            <Stack
              display={{ base: "flex", md: "none" }}
              direction="row"
              justify="center"
              width="100%"
              align="center"
            >
              <NextLink href="/stores" passHref>
                <Button variant="solid-outline" size="lg">
                  Go Shopping
                </Button>
              </NextLink>
              <NextLink href="/setup" passHref>
                <Button size="lg">Setup my store</Button>
              </NextLink>
            </Stack>
          </Container>
        </Box>
      </chakra.header>

      <Container
        maxW="100%"
        pt="20"
        mb={{ base: "2rem", md: "4rem" }}
        centerContent
      >
        <Text
          fontSize={{ base: "sm", md: "xl" }}
          // px={{ base: "2rem", md: "0" }}
          textAlign="center"
          mb="2"
        >
          <strong>Qua</strong> is decentralizing every store online
        </Text>
        <Heading
          textAlign="center"
          color="#000000"
          size="md"
          fontSize={{ base: "1.5rem", md: "36" }}
        >
          Sell to your customers in 3 easy steps...
        </Heading>
      </Container>

      <Container maxW="100%">
        <Carousel centerMode interval={8000} infiniteLoop>
          <Box
            bgImage={{
              base: "url('/images/m_setup-store.png')",
              md: "url('/images/setup.png')",
            }}
            bgPosition="center center"
            bgRepeat="no-repeat"
            bgSize="contain"
            MaxW="100%"
            height="80vh"
            m="1"
          />
          <Box
            bgImage={{
              base: "url('/images/m_add-product.png')",
              md: "url('/images/inventory.png')",
            }}
            bgPosition="center center"
            bgRepeat="no-repeat"
            bgSize="contain"
            MaxW="100%"
            height="80vh"
            m="1"
          />
          <Box
            bgImage={{
              base: "url('/images/m_fufill-orders.png')",
              md: "url('/images/orders.png')",
            }}
            bgPosition="center center"
            bgRepeat="no-repeat"
            bgSize="contain"
            MaxW="100%"
            height="80vh"
            m="1"
          />
        </Carousel>
      </Container>
      <Container maxW="100%" centerContent>
        <Flex p="4">
          <NextLink href="/setup" passHref>
            <Button variant="solid-outline" size="lg" width="348px">
              Setup my store
            </Button>
          </NextLink>
        </Flex>
      </Container>

      <Container
        maxW="100%"
        pt="20"
        mb={{ base: "2rem", md: "4rem" }}
        centerContent
      >
        <Heading
          textAlign="center"
          color="#000000"
          size="md"
          fontSize={{ base: "1.8rem", md: "36" }}
          mb="4"
        >
          Customers shop in a breath with ease.
        </Heading>
        {/* <Text fontSize="xl" textAlign="center">
          Direct shopping from your favorite dealer is breez·y
        </Text> */}
      </Container>

      <Container maxW="100%">
        <Carousel centerMode interval={8000} infiniteLoop>
          <Box
            bgImage={{
              base: "url('/images/m_product-view.png')",
              md: "url('/images/product-view.png')",
            }}
            bgPosition="center center"
            bgRepeat="no-repeat"
            bgSize="contain"
            MaxW="100%"
            height="80vh"
            marginInline="12px"
          />
          <Box
            bgImage={{
              base: "url('/images/m_track.png')",
              md: "url('/images/track.png')",
            }}
            bgPosition="center center"
            bgRepeat="no-repeat"
            bgSize="contain"
            marginInline="12px"
            MaxW="100%"
            height="80vh"
          />
        </Carousel>
      </Container>

      <Container
        maxW={{ base: "100%", md: "container.xl" }}
        px={{ base: "0", md: "24" }}
        py={{ base: "8", md: "48" }}
        centerContent
      >
        <Stack
          bgImage="radial-gradient(120.68% 530.23% at 80.3% -12.06%, rgba(253, 118, 203, 0.8) 25.18%, rgba(255, 172, 48, 0.8) 100%),url('/images/cta_bg.png')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="cover"
          // marginInline="12px"
          MaxW="100%"
          px={{ base: "0", md: "64" }}
          py={{ base: "0", md: "24" }}
          // align="center"
          pos="relative"
          boxShadow="0px 10px 180px 10px rgba(253, 118, 203, 0.72)"

          // justify="center"
        >
          <Image
            boxSize="4rem"
            display={{ base: "block", md: "none" }}
            objectFit="cover"
            src="/svg/qua_mark_white.svg"
            alt="Qua Mark"
            pos="absolute"
            right="2"
            top="16"
          />
          <Image
            boxSize="100"
            display={{ base: "none", md: "block" }}
            objectFit="cover"
            src="/qua-mark-white.svg"
            alt="Qua Mark"
            pos="absolute"
            right="12"
            top="12"
          />

          <Stack pr={{ base: "0", md: "24" }} p={{ base: "8", md: "0" }}>
            <Stack
              direction="row"
              color="#fff"
              spacing={{ base: "4", md: "8" }}
            >
              <Text color="#fff" fontSize="lg">
                Fast
              </Text>
              <Text color="#fff" fontSize="lg">
                Global
              </Text>
              <Text color="#fff" fontSize="lg">
                Secure
              </Text>
              <Text color="#fff" fontSize="lg">
                interoperable
              </Text>
            </Stack>

            <Stack py={5} spacing={{ base: "0", md: "0" }}>
              <Text color="#000" fontSize="2xl" fontWeight="400">
                The future of{" "}
              </Text>
              <Stack spacing={{ base: "4", md: "8" }}>
                <Heading
                  fontFamily="Darker Grotesque"
                  fontSize={{ base: "4xl", md: "5xl" }}
                  color="#000"
                >
                  payments it crypto!
                </Heading>
                <Heading
                  fontFamily="Darker Grotesque"
                  fontSize={{ base: "4xl", md: "5xl" }}
                  color="#000"
                >
                  eCommerce It P2P!
                </Heading>
              </Stack>
            </Stack>

            <Stack py={5} spacing={{ base: "4", md: "4" }}>
              <Text
                color="#fff"
                fontSize="lg"
                fontWeight="600"
                letterSpacing="0.5px"
                textTransform="uppercase"
              >
                Join the revolution
              </Text>
              <Stack direction={{ base: "column", md: "row" }}>
                <NextLink href="/setup" passHref>
                  <Button
                    w={{ base: "100%", md: "15.5rem" }}
                    variant="solid"
                    bgColor="#fff"
                    color="#000"
                    size="lg"
                    _hover={{ bgColor: "#fff" }}
                  >
                    Start selling
                  </Button>
                </NextLink>
                <NextLink href="/stores" passHref>
                  <Button
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
        </Stack>
      </Container>
    </WebsiteLayout>
  );
};

export default Home;
