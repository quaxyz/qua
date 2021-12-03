import { Button } from '@chakra-ui/button'
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Head from 'next/head'
import WebsiteLayout from '../components/layouts/website'

const Home: NextPage = () => {
  return (
    <WebsiteLayout>
      <Head>
        <title>Home - Qua</title>
      </Head>
      <header className="header">
        <Box
          bgImage="url('/hedr-bg-home.svg')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="80% 120%"
          mt="12"
        >
          <Container maxW="container.lg" py="20" centerContent>
            <Box maxW="48rem" mb="8">
              <Heading
                textAlign="center"
                color="#000000"
                size="lg"
                fontSize="64"
                mb="4"
              >
                Connecting every bussiness to a customer
              </Heading>
              <Text fontSize="2xl" textAlign="center">
                On the world’s largest P2P ecommerce stores
              </Text>
            </Box>

            <Flex p="4">
              <Box>
                <Button variant="outline" mr="4" size="lg">
                  Go Shopping
                </Button>
              </Box>
              <Box>
                <Button size="lg">Setup my store</Button>
              </Box>
            </Flex>
          </Container>
        </Box>
      </header>

      <Container maxW="container.lg" pt="20" centerContent>
        <Box maxW="48rem">
          <Text fontSize="xl" textAlign="center" mb="2">
            <strong>Qua</strong> is bringing every bussiness online
          </Text>
          <Heading textAlign="center" color="#000000" size="md" fontSize="36">
            Sell to your customers in 3 easy steps...
          </Heading>
        </Box>
      </Container>

      <Container maxW="container.xl">
      <Carousel autoPlay  centerMode interval={2000} infiniteLoop >
        <Box
          bgImage="url('/images/setup.png')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="contain"
          MaxW="100%"
          height="100vh"
        />
        <Box
          bgImage="url('/images/inventory.png')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="contain"
          MaxW="100%"
          height="100vh"
        />
        <Box
          bgImage="url('/images/orders.png')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="contain"
          MaxW="100%"
          height="100vh"
        />
        </Carousel>
      </Container>
      <Container centerContent>
        <Flex p="4" mt="-16">
          <Button variant="outline" size="lg" width="348px">
            Setup my store
          </Button>
        </Flex>
      </Container>

      <Container maxW="container.lg" pt="20" centerContent>
        <Box maxW="48rem">
          <Heading
            textAlign="center"
            color="#000000"
            size="md"
            fontSize="36"
            mb="4"
          >
            Customers shop in a breath with ease.
          </Heading>
          <Text fontSize="xl" textAlign="center">
            Direct shopping from your favorite dealer is breez·y
          </Text>
        </Box>
      </Container>
      <Container maxW="container.xl">
      <Carousel autoPlay  centerMode interval={2000} infiniteLoop >
        <Box
          bgImage="url('/images/product-view.png')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="contain"
          MaxW="100%"
          height="100vh"
          marginInline="12px"
          />
        <Box
          bgImage="url('/images/track.png')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="contain"
          marginInline="12px"
          MaxW="100%"
          height="100vh"
        />
        </Carousel>
      </Container>

      <Container maxW="container.lg">
        <Box
          bgImage="url('/images/footer-cta.svg')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="contain"
          MaxW="100%"
          height="100vh"
          position="relative"
        >
          <Box position="absolute" bottom="16rem" left="13em">
            <Text fontSize="2xl" color="#fff">
              Join the revolution
            </Text>
            <Flex pt="4" flexDirection="column">
              <Box>
                <Button
                  variant="solid"
                  size="lg"
                  mb="4"
                  width="248px"
                  backgroundColor="#fff"
                  color="#000"
                >
                  Start selling
                </Button>
              </Box>
              <Box>
                <Button
                  variant="outline"
                  borderColor="#fff"
                  color="#fff"
                  size="lg"
                  width="248px"
                >
                  Go Shopping
                </Button>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Container>
    </WebsiteLayout>
  )
}

export default Home
