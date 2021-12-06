import { Box, Container, Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import WebsiteLayout from '../components/layouts/website'

const Stores: NextPage = () => {
  return (
    <WebsiteLayout>
      <Head>
        <title>P2P Stores - Qua</title>
      </Head>
      <header className="header">
        <Box
          bgImage="url('/hedr-bg-store.svg')"
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
                fontSize="48"
                mb="4"
              >
                Shop from the best stores of your dreams
              </Heading>
              <Text fontSize="xl" textAlign="center">
                Browse and shop directly from a collection of businesses{' '}
              </Text>
            </Box>

            <Box>
              <style jsx>{`
                .input {
                  width: 580px;
                  borderradius: 0;
                  background: #ffffff;
                  border: 1px solid rgba(0, 0, 0, 0.24);
                  padding: 1rem 1.4rem;
                  outline: none;
                }

                .input:focus {
                  border: 1px solid rgba(0, 0, 0, 1);
                }
              `}</style>
              <form id="search" className="form-store">
                <input
                  className="input"
                  type="search"
                  placeholder="Search: “store name”, “industry”, “location”, “product name” ..."
                />
              </form>
            </Box>
          </Container>
        </Box>
      </header>
    </WebsiteLayout>
  )
}

export default Stores
