import {
  Box,
  chakra,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  ListItem,
  Spacer,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import WebsiteLayout from "components/layouts/website";

const About: NextPage = () => {
  return (
    <WebsiteLayout>
      <Head>
        <title>About - Qua</title>
      </Head>
      <chakra.header>
        <Box bgColor="#000" maxW="100%">
          <Container
            maxW="100%"
            py="20"
            height="50vh"
            display="flex"
            justifyContent="center"
            centerContent
          >
            <Box
              maxW="100%"
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
                href="https://www.instagram.com/qua_xyz/"
                color="#fff"
                textTransform="uppercase"
                fontSize="sm"
                isExternal
              >
                Instagram
              </Link>{" "}
              <Spacer mx="2" />
              <Link
                href="https://twitter.com/qua_xyz"
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
          width={{ base: "200px", md: "16%" }}
          p={{ base: "2rem", md: "4rem" }}
          mt={{ base: "-2rem", md: "-4rem" }}
          ml={{ base: "1rem", md: "16rem" }}
          display="flex"
          justifyContent="center"
        >
          <Text fontSize="4xl" fontWeight="bold" color="#000">
            About
          </Text>
        </Box>
      </chakra.header>

      <Container
        maxW={{ base: "100%", md: "container.xl" }}
        pr={{ base: "none", md: "8rem" }}
        px={{ base: "4", md: "none" }}
        mb="8rem"
      >
        <Stack direction="column" spacing={{ base: "4", md: "8" }}>
          <Text fontSize="lg" fontWeight="600" color="#000">
            Qua is a technology provider building a decentralized network for
            the e-commerce ecosystem.
          </Text>
          <Spacer py={{ base: "2", md: "4" }} />
          <Heading as="h3" size="lg" textDecoration="underline" color="#000">
            Our vision
          </Heading>
          <Text fontSize="lg" fontWeight="400">
            We&apos;re leveling the playing field in the e-commerce ecosystem by
            providing small-medium businesses a peer-2-peer approach for selling
            directly to their customers (with the tools they need)
            <br />
            <br />
            We aim to achieve this by:
          </Text>
          <UnorderedList fontSize="lg" fontWeight="400" spacing="8">
            <ListItem>
              Providing businesses with an online store they own where their
              customers can easily find them to shop their products anytime
            </ListItem>

            <ListItem>
              Providing inventory management and analytics to help sellers
              better manage their online business
            </ListItem>

            <ListItem>
              Giving sellers the control over how they accept payments and
              enabling crypto payment options
            </ListItem>

            <ListItem>
              Bringing every business online with a seamless approach
            </ListItem>

            <ListItem>
              Helping businesses make more profits online by providing
              frictionless experiences for them and their customers
            </ListItem>
          </UnorderedList>
          <Text fontSize="lg" fontWeight="400">
            We have some core principles that help us do this.
          </Text>
          <Spacer py="4" />
          <Heading as="h3" size="lg" textDecoration="underline" color="#000">
            Core principles
          </Heading>
          <Heading as="h4" size="md">
            Ecommerce trade on qua network is P2P based
          </Heading>
          <Text fontSize="lg" fontWeight="400">
            We believe enabling the P2P approach fosters trust between sellers
            and customers and it provides a huge benefit to businesses by
            helping them stay connected with their customer base.
          </Text>

          <Heading as="h4" size="md">
            Qua utilizes web3 verification system
          </Heading>

          <Text fontSize="lg" fontWeight="400">
            We strive to be the place where sellers and buyers meet to do trade
            online, and for that to work, we&apos;ll need to maintain the
            product to be frictionless and less intrusive at best while making
            sure users are in control of what they do on the network.
            <br /> <br /> By keeping it this way, customers and sellers will be
            able to use qua with their crypto wallets like{" "}
            <Link href="https://metamask.io/" isExternal>
              metamask
            </Link>
            ,{" "}
            <Link href="https://www.coinbase.com/" isExternal>
              coinbase
            </Link>
            , and more.
          </Text>
          <br />

          <Heading as="h4" size="md">
            Qua continues to evolve
          </Heading>

          <Text fontSize="lg" fontWeight="400">
            Qua and the e-commerce ecosystem are constantly evolving.
            <br />
            We make iterative changes as we learn more about how people use the
            product and what the ecosystem wants from it.
            <br /> <br /> The project is closed-source and is maintained and
            developed by a small team of dedicated individuals. <br />
            You can propose to be a part of it -{" "}
            <Link href="#" isExternal>
              Send Proposal
            </Link>
          </Text>
          <Spacer py="4" />
          <Heading as="h3" size="lg" textDecoration="underline" color="#000">
            Brand assets
          </Heading>

          <Stack direction={{ base: "column", md: "row" }}>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stack
                border="2px solid #000"
                align="center"
                px="2.8rem"
                width="100%"
                mb="4"
              >
                <Image
                  src="/svg/qua_logo_black.svg"
                  alt="Qua"
                  width={140}
                  height={60}
                />
              </Stack>
              <Text fontSize="sm">Qua_logo_000.svg</Text>
            </Stack>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              mx="8"
            >
              <Stack
                border="2px solid #000"
                align="center"
                px="2.8rem"
                width="100%"
                mb="4"
              >
                <Image
                  src="/svg/qua_mark_black.svg"
                  alt="Qua"
                  width={140}
                  height={60}
                />
              </Stack>
              <Text fontSize="sm">Qua_mark_000.svg</Text>
            </Stack>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stack
                border="2px solid #000"
                align="center"
                px="2.8rem"
                width="100%"
                mb="4"
              >
                <Image
                  src="/svg/qua_wordmark_black.svg"
                  alt="Qua"
                  layout="fixed"
                  width={140}
                  height={60}
                />
              </Stack>
              <Text>Qua_wordmark_000.svg</Text>
            </Stack>
          </Stack>
          <Spacer py="4" />
          <Stack direction={{ base: "column", md: "row" }}>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stack
                background="#000"
                border="2px solid #000"
                align="center"
                px="2.8rem"
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
              </Stack>
              <Text>Qua_logo_fff.svg</Text>
            </Stack>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              mx="8"
            >
              <Stack
                background="#000"
                border="2px solid #000"
                align="center"
                px="2.8rem"
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
              </Stack>

              <Text>Qua_mark_fff.svg</Text>
            </Stack>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stack
                background="#000"
                border="2px solid #000"
                align="center"
                px="2.8rem"
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
              </Stack>

              <Text>Qua_wordmark_fff.svg</Text>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </WebsiteLayout>
  );
};

export default About;
