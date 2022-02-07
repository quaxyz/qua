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
                fontSize="xs"
                isExternal
              >
                Instagram
              </Link>{" "}
              <Spacer mx="2" />
              <Link
                href="https://discord.gg/nK8Vgae2W8"
                color="#fff"
                textTransform="uppercase"
                fontSize="xs"
                isExternal
              >
                Discord
              </Link>{" "}
              <Spacer mx="2" />
              <Link
                href="https://twitter.com/qua_xyz"
                color="#fff"
                textTransform="uppercase"
                fontSize="xs"
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
        pr={{ base: "none", md: "32rem" }}
        px={{ base: "4", md: "none" }}
        mb="8rem"
      >
        <Stack direction="column" spacing={{ base: "4", md: "8" }}>
          <Text fontSize="lg" fontWeight="600" color="#000">
            Qua is a technology provider decentralizing the eCommerce ecosystem.
          </Text>
          <Spacer py={{ base: "2", md: "4" }} />
          <Heading as="h3" size="lg" textDecoration="underline" color="#000">
            Our vision
          </Heading>
          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            To level the playing field in eCommerce by providing brands and
            customers a peer-2-peer approach for trading directly online,
            removing the hassle of maintaining a website for businesses.
            <br />
            <br />
            We aim to achieve this by:
          </Text>
          <UnorderedList
            fontSize={{ base: "1rem", md: "1.125rem" }}
            fontWeight="400"
            spacing="8"
          >
            <ListItem>
              Establishing a decentralized network where peers can interact
              directly with one another in a permissionless fashion.
            </ListItem>

            <ListItem>
              Insights and inventory tracker to help sellers manage their brand
              online.
            </ListItem>

            <ListItem>
              Giving control over how peers choose to transact with either
              crypto or fiat.
            </ListItem>

            <ListItem>Bringing every business online seamlessly.</ListItem>
          </UnorderedList>
          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            We have some core principles that help us do this.
          </Text>
          <Spacer py="2" />
          <Heading as="h3" size="lg" textDecoration="underline" color="#000">
            Core principles
          </Heading>
          <Heading as="h4" size="md">
            Ecommerce trade is P2P based
          </Heading>
          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            We believe enabling the P2P approach fosters trust between sellers
            and customers, and it provides brands with the benefit of
            maintaining a loyal customer base.
          </Text>

          <Heading as="h4" size="md">
            Qua utilizes web3 verification
          </Heading>

          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            We envision establishing a network where sellers and buyers meet to
            do trade online. <br />
            For that to work, we&apos;re tasked with maintaining a product that
            is less intrusive at best, making sure peers are in control of all
            their activities on the network <br /> <br /> By keeping it this
            way, buyers and sellers will be able to use qua with their crypto
            wallets like{" "}
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

          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            Qua and the e-commerce ecosystem are constantly evolving. We make
            iterative changes as we learn more about how people use the product
            and what the ecosystem wants from it.
          </Text>
          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            We&apos;re deliberately working towards achieving a fully
            decentralized, censorship-resistant eCommerce platform with zero to
            low network fees enabling brands to improve their profit margin, as
            well as increase their respective market share by offering lower
            prices than the competition selling on centralized channels.
          </Text>
          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            At Qua, we prioritize privacy and economic freedom. Data is not
            collected or sold. The team is actively developing the tools
            necessary to enable this vision.
          </Text>
          <Text fontSize={{ base: "1rem", md: "1.125rem" }} fontWeight="400">
            You can come help us shape the future of what it means to
            participate in a decentralized economy. <br /> <br />
            <Link href="https://discord.gg/nK8Vgae2W8" isExternal>
              Reach out to us
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
