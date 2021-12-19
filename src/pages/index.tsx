import { Button } from "@chakra-ui/button";
import {
  Box,
  chakra,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
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
                On the world’s largest P2P ecommerce stores
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
              <Button variant="solid-outline" size="lg">
                Go Shopping
              </Button>
              <Button size="lg">Setup my store</Button>
            </Stack>

            <Stack
              display={{ base: "flex", md: "none" }}
              direction="row"
              justify="center"
              width="100%"
              align="center"
            >
              <Button variant="solid-outline" width="100%" size="lg">
                Go Shopping
              </Button>
              <Button width="100%" size="lg">
                Setup my store
              </Button>
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
        <Text fontSize={{ base: "lg", md: "xl" }} textAlign="center" mb="2">
          <strong>Qua</strong> is bringing every bussiness online
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
          <Button variant="solid-outline" size="lg" width="348px">
            Setup my store
          </Button>
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
        <Text fontSize="xl" textAlign="center">
          Direct shopping from your favorite dealer is breez·y
        </Text>
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

      <Container maxW="container.lg" display={{ base: "none", md: "block" }}>
        <Box
          bgImage={{
            base: "url('/images/m_footer-cta.svg')",
            md: "url('/images/footer-cta.svg')",
          }}
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="contain"
          MaxW="100%"
          height="100vh"
          position="relative"
        >
          <Box
            position="absolute"
            bottom={{ base: "11rem", md: "16rem" }}
            left={{ base: "5rem", md: "13em" }}
          >
            <Text fontSize={{ base: "1xl", md: "2xl" }} color="#fff">
              Join the revolution
            </Text>
            <Flex pt="4" flexDirection="column">
              <Box>
                <Button
                  variant="solid"
                  mb="4"
                  width={{ base: "100%", md: "248px" }}
                  backgroundColor="#fff"
                  color="#000"
                >
                  Start selling
                </Button>
              </Box>
              <Box>
                <Button
                  variant="solid-outline"
                  borderColor="#fff"
                  color="#fff"
                  width="248px"
                >
                  Go Shopping
                </Button>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Container>

      <Container maxW="100%" display={{ base: "block", md: "none" }}>
        <Text fontSize="2xl" align="center" color="#000">
          Join the revolution
        </Text>
        <Stack pt="4" direction="column" spacing="4">
          <Button
            variant="solid"
            size="lg"
            width="100%"
            backgroundColor="#000"
            color="#fff"
          >
            Start selling
          </Button>
          <Button
            variant="solid-outline"
            size="lg"
            width="100%"
            borderColor="#000"
            color="#000"
          >
            Go Shopping
          </Button>
        </Stack>
      </Container>
    </WebsiteLayout>
  );
};

export default Home;
