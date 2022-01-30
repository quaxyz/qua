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
  Link,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import WebsiteLayout from "components/layouts/website";

const Home: NextPage = () => {
  return (
    <WebsiteLayout>
      <Head>
        <title>Decentralize ecommerce - Qua</title>
      </Head>
      <chakra.header maxW="100%">
        <Box
          bgImage="url('/hedr-bg-home.svg')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize={{ base: "cover", md: "80% 120%" }}
          mt={{ base: "12", md: "24" }}
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
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                px={{ base: "2", md: "0" }}
                textAlign="center"
              >
                On the world&apos;s best P2P ecommerce stores
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
                <Button as={Link} variant="solid-outline" size="lg">
                  Go Shopping
                </Button>
              </NextLink>
              <NextLink href="/setup" passHref>
                <Button as={Link} size="lg">
                  Setup my store
                </Button>
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
                <Button as={Link} variant="solid-outline" size="lg">
                  Go Shopping
                </Button>
              </NextLink>
              <NextLink href="/setup" passHref>
                <Button as={Link} size="lg">
                  Setup my store
                </Button>
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
          fontSize={{ base: "md", md: "xl" }}
          // px={{ base: "2rem", md: "0" }}
          textAlign={{ base: "center", md: "center" }}
          mb="2"
        >
          <strong>Qua</strong> is powering every store online
        </Text>
        <Heading
          textAlign={{ base: "center", md: "center" }}
          color="#000000"
          size="md"
          fontSize={{ base: "2xl", md: "36" }}
        >
          Reach your customers in 3 easy steps.
        </Heading>
      </Container>

      <Stack maxW="100%" display={{ base: "none", md: "block" }}>
        <Carousel
          centerMode
          interval={4000}
          infiniteLoop
          showThumbs={false}
          showArrows={true}
        >
          <Stack w="100%" height="90vh" align="center" m="1">
            <Image
              paddingInline="12px"
              w="100%"
              h="auto"
              src="/images/setup.png"
              alt="Setup store"
            />
          </Stack>

          <Stack w="100%" height="90vh" align="center" m="1">
            <Image
              paddingInline="12px"
              w="100%"
              h="auto"
              src="/images/inventory.png"
              alt="Add products"
            />
          </Stack>

          <Stack w="100%" height="90vh" align="center" m="1">
            <Image
              paddingInline="12px"
              w="100%"
              h="auto"
              src="/images/orders.png"
              alt="Fufill orders"
            />
          </Stack>
        </Carousel>
      </Stack>

      {/* Mobile display */}
      <Stack maxW="100%" display={{ base: "block", md: "none" }}>
        <Carousel
          centerMode
          interval={4000}
          showThumbs={false}
          showArrows={true}
        >
          <Stack w="100%" height="80vh" align="center" m="1">
            <Image
              paddingInline="12px"
              boxSize="100%"
              src="/images/m_setup-store.png"
              alt="Setup store"
            />
          </Stack>

          <Stack w="100%" height="80vh" align="center" m="1">
            <Image
              paddingInline="12px"
              boxSize="100%"
              src="/images/m_add-product.png"
              alt="Add products"
            />
          </Stack>

          <Stack w="100%" height="80vh" align="center" m="1">
            <Image
              paddingInline="12px"
              boxSize="100%"
              src="/images/m_fufill-orders.png"
              alt="Fufill orders"
            />
          </Stack>
        </Carousel>
      </Stack>

      <Container maxW="100%" centerContent>
        <Flex p="4">
          <NextLink href="/setup" passHref>
            <Button
              as={Link}
              variant="solid-outline"
              size="lg"
              width={{ base: "324px", md: "348px" }}
            >
              Setup my store
            </Button>
          </NextLink>
        </Flex>
      </Container>

      <Container
        maxW="100%"
        pt={{ base: "20", md: "12rem" }}
        mb={{ base: "2rem", md: "4rem" }}
        centerContent
      >
        <Heading
          textAlign={{ base: "center", md: "center" }}
          color="#000000"
          size="md"
          fontSize={{ base: "1.8rem", md: "36" }}
          mb="2"
        >
          Customers shop in a breath with ease.
        </Heading>
      </Container>

      <Container maxW="100%" display={{ base: "none", md: "block" }}>
        <Carousel centerMode interval={8000} infiniteLoop showThumbs={false}>
          <Box
            bgImage={{
              base: "url('/images/m_product-view.png')",
              md: "url('/images/product-view.png')",
            }}
            bgPosition="center center"
            bgRepeat="no-repeat"
            bgSize="contain"
            maxW="100%"
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
            maxW="100%"
            height="80vh"
          />
        </Carousel>
      </Container>

      {/* Mobile display */}
      <Stack maxW="100%" display={{ base: "block", md: "none" }}>
        <Carousel
          centerMode
          interval={4000}
          showThumbs={false}
          showArrows={true}
        >
          <Stack w="100%" height="80vh" align="center" m="1">
            <Image
              paddingInline="12px"
              boxSize="100%"
              src="/images/m_product-view.png"
              alt="Setup store"
            />
          </Stack>

          <Stack w="100%" height="80vh" align="center" m="1">
            <Image
              paddingInline="12px"
              boxSize="100%"
              src="/images/m_track.png"
              alt="Add products"
            />
          </Stack>
        </Carousel>
      </Stack>

      <Container
        maxW="100%"
        px={{ base: "0", md: "1rem" }}
        pt={{ base: "16", md: "48" }}
        centerContent
      >
        <Stack
          direction="column"
          align="flex-end"
          mb={{ base: "auto", md: "12rem" }}
          pb={{ base: "12", md: "0" }}
        >
          <Stack>
            <Heading
              ml={{ base: "-4rem", md: "-4rem" }}
              fontSize={{ base: "62px", md: "148px" }}
              color="#000"
            >
              Crypto.
            </Heading>
            <Heading fontSize={{ base: "62px", md: "148px" }} color="#000">
              Fiat.
            </Heading>
          </Stack>

          <Text color="#000" fontSize={{ base: "16px", md: "24px" }}>
            All the payment options you like
          </Text>
        </Stack>
      </Container>
    </WebsiteLayout>
  );
};

export default Home;
