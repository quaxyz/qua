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
          px={{ base: "4", md: "8rem" }}
          py={{ base: "4", md: "8" }}
          maxW="100%"
          pos="absolute"
          top="0"
          left="0"
          right="0"
          zIndex="2"
        >
          <NextLink href="/" passHref>
            <a>
              <Box pl={{ base: "0", md: "4rem" }}>
                <Image
                  src="/svg/qua_logo_white.svg"
                  alt="Qua logo"
                  layout="fixed"
                  width={{ base: "3.75rem", md: "6rem" }}
                  height={{ base: "3.75rem", md: "6rem" }}
                />
              </Box>
            </a>
          </NextLink>

          <Stack direction="row" spacing="8">
            <NextLink href="/setup" passHref>
              <Link>Start selling</Link>
            </NextLink>
          </Stack>
        </Stack>
      </chakra.nav>

      <Container
        maxW="100%"
        h={{ base: "100%", md: "60vh" }}
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
          px={{ base: "2", md: "7rem" }}
          // pr={{ base: "2", md: "5rem" }}
          // pb={{ base: "4rem", md: "16rem" }}
          pt={{ base: "7rem", md: "12rem" }}
          w="100%"
          spacing="0.6rem"
        >
          <Stack w="100%" pl={{ base: "0", md: "4rem" }}>
            <Stack maxW={{ base: "100%", md: "48rem" }} mb="8">
              <Heading
                color="#fff"
                fontWeight="800"
                fontSize={{ base: "1.8rem", md: "62" }}
                mb="4"
              >
                Welcome to Qua.
              </Heading>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                color="#fff"
                opacity="0.72"
              >
                The home for modern eCommerce brands
              </Text>
            </Stack>

            <Stack
              direction={{ base: "column", md: "row" }}
              w="100%"
              align={{ base: "left", md: "center" }}
              spacing="4"
            >
              <NextLink href="/setup" passHref>
                <Button
                  as={Link}
                  variant="solid-outline"
                  px="12"
                  size="lg"
                  bgColor="#fff"
                  color="#000"
                >
                  Get Started
                </Button>
              </NextLink>

              <NextLink href="/stores" passHref>
                <Button
                  as={Link}
                  variant="solid-outline"
                  size="lg"
                  color="#fff"
                  borderColor="#fff"
                >
                  Go Shopping
                </Button>
              </NextLink>
            </Stack>
          </Stack>

          <Stack
            align="center"
            justify="center"
            spacing="12"
            position="fixed"
            right={{ base: "1rem", md: "5rem" }}
            top={{ base: "1", md: "10rem" }}
          >
            <Stack
              h={{ base: "80px", md: "100" }}
              w="0.8px"
              bgColor="rgba(0, 0, 0, 0.24)"
            />
            <VStack spacing="8">
              <Link
                href="https://www.instagram.com/qua_xyz/"
                color="#000"
                textTransform="uppercase"
                fontSize="xs"
                // transformOrigin="0 0"
                transform="rotate(90deg)"
                borderBottom="none"
                isExternal
              >
                Instagram
              </Link>{" "}
              <Spacer mx="2" />
              <Link
                href="https://discord.gg/nK8Vgae2W8"
                color="#000"
                textTransform="uppercase"
                fontSize="xs"
                transform="rotate(90deg)"
                borderBottom="none"
                isExternal
              >
                Discord
              </Link>{" "}
              <Spacer mx="2" />
              <Link
                href="https://twitter.com/qua_xyz"
                color="#000"
                textTransform="uppercase"
                fontSize="xs"
                transform="rotate(90deg)"
                borderBottom="none"
                isExternal
              >
                Twitter
              </Link>
            </VStack>
            <Stack
              h={{ base: "80px", md: "100" }}
              w="0.8px"
              bgColor="rgba(0, 0, 0, 0.24)"
            />
          </Stack>
        </Stack>
      </Container>

      <Container maxW="100%">
        <Stack
          px={{ base: "4", md: "11rem" }}
          py={{ base: "2", md: "16" }}
          spacing="12"
        >
          <FormGroup id="search" labelProps={{ variant: "flushed" }}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<Search />} />
              <Input
                type="search"
                fontWeight="300"
                placeholder="What are you shopping for?"
                variant="flushed"
                size="lg"
                // value={formValue.name}
                // onChange={(e) =>
                //   setFormValue({ ...formValue, name: e.target.value })
                // }
              />
            </InputGroup>
          </FormGroup>

          <Stack>
            <Text
              as="span"
              color="#131415"
              fontWeight="300"
              fontSize={{ base: "1.4rem", md: "2rem" }}
            >
              Shop from near you
            </Text>
            <Text
              fontSize={{ base: "1.125rem", md: "1rem" }}
              opacity="0.48"
              color="#131415"
            >
              Cut carbon emmisions. Save the planet.
            </Text>

            <Stack py={{ base: "2", md: "6" }} direction="row" spacing="4">
              <Button
                variant="solid-outline"
                size="lg"
                px={{ base: "1", md: "12" }}
              >
                Lagos
              </Button>
              <Button
                variant="solid-outline"
                size="lg"
                px={{ base: "1", md: "12" }}
              >
                Ikeja
              </Button>
              <Button
                variant="solid-outline"
                size="lg"
                px={{ base: "1", md: "12" }}
              >
                Abuja
              </Button>
            </Stack>
          </Stack>

          <Stack>
            <Stack direction="row" align="center" justify="space-between">
              <Text
                as="span"
                color="#131415"
                fontWeight="300"
                fontSize={{ base: "1.4rem", md: "1.8rem" }}
              >
                Shop by category
              </Text>
              <Link fontSize={{ base: "1.125rem", md: "1rem" }} color="#131415">
                See all
              </Link>
            </Stack>

            <Stack py={{ base: "2", md: "6" }} direction="row" spacing="4">
              <Box
                flex="1"
                h="350px"
                bgRepeat="no-repeat"
                bgSize="cover"
                bgPosition="center"
                bgImage="url(/images/rachit-tank-2cFZ_FB08UM-unsplash.jpg)"
              >
                <Stack w="100%" p="8" h="100%">
                  <Heading flex="1" fontSize={{ base: "1.125rem", md: "24px" }}>
                    Electronics
                  </Heading>
                  <Button
                    alignSelf="flex-end"
                    variant="primary-outline"
                    bgColor="#fff"
                    px="12"
                    py="6"
                    border="none"
                    color="#000"
                  >
                    Shop now
                  </Button>
                </Stack>
              </Box>
              <Box
                flex="1"
                h="350px"
                bgRepeat="no-repeat"
                bgSize="cover"
                bgPosition="center"
                bgImage="url(/images/ehimetalor-akhere-unuabona-okTqiC9Xqho-unsplash.jpg)"
              >
                <Stack w="100%" p="8" h="100%">
                  <Heading flex="1" fontSize={{ base: "1.125rem", md: "24px" }}>
                    Fashion
                  </Heading>
                  <Button
                    alignSelf="flex-end"
                    variant="primary-outline"
                    bgColor="#fff"
                    px="12"
                    py="6"
                    border="none"
                    color="#000"
                  >
                    Shop now
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Stack py="4" borderTop="0.8px solid rgba(0, 0, 0, 0.24)" w="100%" />

      <Container maxW="100%" px="8">
        <Stack
          bgRepeat="no-repeat"
          bgSize="cover"
          bgPosition="center"
          bgImage="url(/images/kamran-abdullayev-DvFrRwuyn88-unsplash.jpg)"
          px={{ base: "4", md: "11rem" }}
          py={{ base: "2", md: "10rem" }}
          spacing="2"
        >
          <Stack maxW={{ base: "100%", md: "48rem" }} mb="8" spacing="2">
            <Heading
              color="#fff"
              fontWeight="800"
              fontSize={{ base: "1.8rem", md: "64" }}
              mb="4"
            >
              Grow your <br />
              bussiness with Qua{" "}
            </Heading>
            <Text
              fontSize={{ base: "16px", md: "18px" }}
              color="#fff"
              opacity="87%"
              w={{ base: "100%", md: "570px" }}
            >
              Set up a personalized store in an instant, sell to anyone,
              anywhere — Get the insights you need to grow with a simple
              dashboard to manage orders, shipping, and payments all in one
              place.
            </Text>
          </Stack>
          <NextLink href="/setup" passHref>
            <Button
              as={Link}
              variant="solid-outline"
              alignSelf="flex-start"
              px="12"
              size="lg"
              bgColor="#fff"
              border="none"
              color="#000"
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
      </Stack>
    </>
  );
};

export default Home;
