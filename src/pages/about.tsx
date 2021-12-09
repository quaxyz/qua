import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  ListItem,
  Spacer,
  Text,
  UnorderedList
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import WebsiteLayout from '../components/layouts/website'

const About: NextPage = () => {
  return (
    <WebsiteLayout>
      <Head>
        <title>About - Qua</title>
      </Head>
      <header>
        <Box bgColor="#000" maxW="100%">
          <Container
            maxW="container.lg"
            py="20"
            height="50vh"
            display="flex"
            justifyContent="center"
            centerContent
          >
            <Box
              maxW="48rem"
              mb="8"
              justifyContent="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Text
                fontSize="md"
                textTransform="uppercase"
                fontWeight="bold"
                color="#fff"
                background="rgba(255, 255, 255, 0.08)"
                py="2"
                px="4"
                mb="2"
                borderRadius="50"
              >
                Technology
              </Text>
              <Image
                src="/qua.svg"
                alt="Qua"
                layout="fixed"
                width={100}
                height={100}
              />
            </Box>
            <Flex>
              <Link
                href="#"
                color="#fff"
                textTransform="uppercase"
                fontSize="sm"
                isExternal
              >
                Instagram
              </Link>{' '}
              <Spacer mx="2" />
              <Link
                href="#"
                color="#fff"
                textTransform="uppercase"
                fontSize="sm"
                isExternal
              >
                Twitter
              </Link>
            </Flex>
          </Container>
        </Box>
        <Box
          background="#fff"
          width="16%"
          p="4rem"
          mt="-4rem"
          ml="16rem"
          display="flex"
          justifyContent="center"
        >
          <Text fontSize="4xl" fontWeight="bold" color="#000">
            About
          </Text>
        </Box>
      </header>

      <Container maxW="container.xl" pr="8rem" mb="8rem">
        <Text fontSize="lg" fontWeight="600" color="#000">
          Qua is a technology provider building a decentralized network for the
          e-commerce ecosystem.
        </Text>
        <Spacer />
        <br />
        <Heading as="h3" size="lg" textDecoration="underline" color="#000">
          Our vision
        </Heading>
        <br />
        <Text fontSize="lg" fontWeight="400">
          We&apos;re leveling the playing field in the e-commerce ecosystem by
          providing small-medium businesses a peer-2-peer approach of selling
          directly to their customers (with the tools they need)
          <br />
          <br />
          We aim to achieve this by:
        </Text>
        <br />
        <UnorderedList fontSize="lg" fontWeight="400">
          <ListItem>
            Providing businesses with an online store they own where their
            customers can easily find them to shop their products anytime
          </ListItem>
          <Spacer my="1rem" />
          <ListItem>
            Providing inventory management and analytics to help sellers better
            manage their online business
          </ListItem>
          <Spacer my="1rem" />
          <ListItem>
            Giving sellers the control over how they accept payments and
            enabling crypto payment options
          </ListItem>
          <Spacer my="1rem" />
          <ListItem>
            Bringing every business online with a seamless approach
          </ListItem>
          <Spacer my="1rem" />
          <ListItem>
            Helping businesses make more profits online by providing
            frictionless experiences for them and their customers
          </ListItem>
        </UnorderedList>
        <br />
        <Text fontSize="lg" fontWeight="400">
          We have some core principles that help us do this.
        </Text>
        <br />
        <Heading as="h3" size="lg" textDecoration="underline" color="#000">
          Core principles
        </Heading>
        <br />
        <Spacer my="1rem" />
        <Heading as="h4" size="md">
          Ecommerce trade on qua network is P2P based
        </Heading>
        <Spacer my="1rem" />

        <Text fontSize="lg" fontWeight="400">
          We believe enabling the P2P approach fosters trust between sellers and
          customers and it provides a huge benefit to businesses by helping them
          stay connected with their customer base.
        </Text>
        <br />
        <Spacer my="1rem" />

        <Heading as="h4" size="md">
          Qua utilizes web3 verification system
        </Heading>
        <Spacer my="1rem" />
        <Text fontSize="lg" fontWeight="400">
          We strive to be the place where sellers and buyers meet to do trade
          online, and for that to work, we&apos;ll need to maintain the product
          to be frictionless and less intrusive at best while making sure users
          are in control of what they do on the network.
          <Spacer my="1rem" />
          By keeping it this way, customers and sellers will be able to use qua
          with their crypto wallets like{' '}
          <Link href="https://metamask.io/" isExternal>
            metamask
          </Link>
          ,{' '}
          <Link href="https://www.coinbase.com/" isExternal>
            coinbase
          </Link>
          , and more.
        </Text>
        <br />
        <Spacer my="1rem" />

        <Heading as="h4" size="md">
          Qua continues to evolve
        </Heading>
        <Spacer my="1rem" />
        <Text fontSize="lg" fontWeight="400">
          Qua and the e-commerce ecosystem are constantly evolving.
          <br />
          We make iterative changes as we learn more about how people use the
          product and what the ecosystem wants from it.
          <Spacer my="1rem" />
          The project is closed-source and is maintained and developed by a
          small team of dedicated individuals. <br />
          You can propose to be a part of it -{' '}
          <Link href="#" isExternal>
            Send Proposal
          </Link>
        </Text>
        <br />
        <Spacer my="4rem" />

        <Heading as="h3" size="lg" textDecoration="underline" color="#000">
          Brand assets
        </Heading>
        <br />
        <Flex>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Box border="2px solid #000" px="4rem" width="100%" mb="4">
              <Image
                src="/svg/qua_logo_black.svg"
                alt="Qua"
                layout="fixed"
                width={140}
                height={60}
              />
            </Box>
            <Text>Qua_logo_000.svg</Text>
          </Flex>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            mx="8"
          >
            <Box border="2px solid #000" px="4rem" width="100%" mb="4">
              <Image
                src="/svg/qua_mark_black.svg"
                alt="Qua"
                layout="fixed"
                width={140}
                height={60}
              />
            </Box>
            <Text>Qua_mark_000.svg</Text>
          </Flex>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Box border="2px solid #000" px="4rem" width="100%" mb="4">
              <Image
                src="/svg/qua_wordmark_black.svg"
                alt="Qua"
                layout="fixed"
                width={140}
                height={60}
              />
            </Box>
            <Text>Qua_wordmark_000.svg</Text>
          </Flex>
        </Flex>
        <Spacer my="2.4rem" />
        <Flex>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Box
              background="#000"
              border="2px solid #000"
              px="4rem"
              width="100%"
              mb="4"
            >
              <Image
                src="/svg/qua_logo_white.svg"
                alt="Qua"
                layout="fixed"
                width={140}
                height={60}
              />
            </Box>
            <Text>Qua_logo_fff.svg</Text>
          </Flex>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            mx="8"
          >
            <Box
              background="#000"
              border="2px solid #000"
              px="4rem"
              width="100%"
              mb="4"
            >
              <Image
                src="/svg/qua_mark_white.svg"
                alt="Qua"
                layout="fixed"
                width={140}
                height={60}
              />
            </Box>
            <Text>Qua_mark_fff.svg</Text>
          </Flex>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Box
              background="#000"
              border="2px solid #000"
              px="4rem"
              width="100%"
              mb="4"
            >
              <Image
                src="/svg/qua_wordmark_white.svg"
                alt="Qua"
                layout="fixed"
                width={140}
                height={60}
              />
            </Box>
            <Text>Qua_wordmark_fff.svg</Text>
          </Flex>
        </Flex>
        <Spacer my="4rem" />
        <Heading as="h4" size="md">
          Color
        </Heading>
        <Spacer my="2.4rem" />
        <Flex>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Box
              background="#000"
              border="2px solid #000"
              p="6rem"
              width="100%"
              mb="4"
            >
              <Text color="#fff">#000</Text>
            </Box>
            <Text>Black</Text>
          </Flex>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            mx="8"
          >
            <Box border="2px solid #000" p="6rem" width="100%" mb="4">
              <Text color="#000">#FFF</Text>
            </Box>
            <Text>White</Text>
          </Flex>
        </Flex>
        <Spacer my="4rem" />
        <Heading as="h4" size="md">
          Partnership Guidelines
        </Heading>
        <Spacer my="2.4rem" />
        <Box mb="6">
          <Image
            src="/svg/partnership_black.svg"
            alt="Partnership"
            layout="fixed"
          />
        </Box>
        <Box>
          <Image
            src="/svg/partnership_white.svg"
            alt="Partnership"
            layout="fixed"
          />
        </Box>
      </Container>
    </WebsiteLayout>
  )
}

export default About
