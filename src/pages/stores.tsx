import { Button } from '@chakra-ui/button'
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import WebsiteLayout from '../components/layouts/website'

const Stores: NextPage = () => {
  return (
    <WebsiteLayout>
      <Head>
        <title>P2P Stores - Qua</title>
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
    </WebsiteLayout>
  )
}

export default Stores
