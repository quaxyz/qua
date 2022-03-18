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
          px={{ base: "5", md: "8rem" }}
          py={{ base: "2", md: "8" }}
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
                  width={{ base: "5.75rem", md: "6rem" }}
                  height={{ base: "5.75rem", md: "6rem" }}
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
        h={{ base: "50vh", md: "58vh" }}
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
          pt={{ base: "8rem", md: "12rem" }}
          w="100%"
          spacing="0.6rem"
        >
          <Stack w="100%" pl={{ base: "0", md: "4rem" }}>
            <Stack
              maxW={{ base: "100%", md: "48rem" }}
              mb={{ base: "6", md: "8" }}
            >
              <Heading
                color="#fff"
                fontWeight="800"
                fontSize={{ base: "32px", md: "62" }}
                mb={{ base: "2", md: "4" }}
              >
                Welcome to Qua.
              </Heading>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                color="#fff"
                opacity="0.87"
              >
                The home for modern ecommerce brands and online shopping
              </Text>
            </Stack>

            <Stack direction="row" spacing="4">
              <NextLink href="/setup" passHref>
                <Button
                  display={{ base: "none", md: "flex" }}
                  as={Link}
                  variant="solid-outline"
                  px="12"
                  size="lg"
                  bgColor="#fff"
                  border="none"
                  color="#000"
                >
                  Get Started
                </Button>
              </NextLink>

              <NextLink href="/setup" passHref>
                <Button
                  display={{ base: "flex", md: "none" }}
                  as={Link}
                  variant="solid-outline"
                  size="md"
                  m="0 !important"
                  bgColor="#fff"
                  border="none"
                  color="#000"
                >
                  Get Started
                </Button>
              </NextLink>

              <NextLink href="/stores" passHref>
                <Button
                  as={Link}
                  display={{ base: "none", md: "flex" }}
                  variant="solid-outline"
                  size="lg"
                  color="#fff"
                  borderColor="#fff"
                >
                  Go Shopping
                </Button>
              </NextLink>
              <NextLink href="/stores" passHref>
                <Button
                  display={{ base: "flex", md: "none" }}
                  as={Link}
                  variant="solid-outline"
                  size="md"
                  color="#fff"
                  borderColor="#fff"
                >
                  Go Shopping
                </Button>
              </NextLink>
            </Stack>
          </Stack>

          <Stack
            display={{ base: "none", md: "flex" }}
            align="center"
            justify="center"
            spacing="12"
            position="fixed"
            right={{ base: "0.015px", md: "5rem" }}
            top={{ base: "6rem", md: "10rem" }}
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
                fontSize={{ base: "10px", md: "12px" }}
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
                fontSize={{ base: "10px", md: "12px" }}
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
                fontSize={{ base: "10px", md: "12px" }}
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
          px={{ base: "2", md: "11rem" }}
          py={{ base: "0", md: "16" }}
          spacing="12"
        >
          <FormGroup id="search" labelProps={{ variant: "flushed" }}>
            <InputGroup display={{ base: "none", md: "block" }}>
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
          {/* Mobile display */}
          <FormGroup id="search" labelProps={{ variant: "flushed" }}>
            <InputGroup display={{ base: "block", md: "none" }}>
              <InputLeftElement pointerEvents="none" children={<Search />} />
              <Input
                type="search"
                fontWeight="300"
                placeholder="What are you shopping for?"
                variant="flushed"
                size="md"
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
              fontSize={{ base: "1rem", md: "1rem" }}
              fontWeight="400"
              opacity="0.48"
              color="#131415"
            >
              Save the planet.
            </Text>

            <Stack
              py={{ base: "2", md: "6" }}
              direction="row"
              // direction={{ base: "column", md: "row" }}
              spacing="4"
            >
              <Button
                variant="solid-outline"
                size="md"
                width={{ base: "100%", md: "auto" }}
                px={{ base: "8", md: "12" }}
              >
                Chicago
              </Button>
              <Button
                variant="solid-outline"
                size="md"
                width={{ base: "100%", md: "auto" }}
                px={{ base: "8", md: "12" }}
              >
                New York
              </Button>
              <Button
                variant="solid-outline"
                size="md"
                width={{ base: "100%", md: "auto" }}
                px={{ base: "8", md: "12" }}
              >
                Boston
              </Button>
            </Stack>
          </Stack>

          <Stack py={{ base: "2", md: "0" }}>
            <Stack direction="row" align="center" justify="space-between">
              <Text
                as="span"
                color="#131415"
                fontWeight="300"
                fontSize={{ base: "1.2rem", md: "1.8rem" }}
              >
                Shop by category
              </Text>
              <Link fontSize={{ base: "14px", md: "1rem" }} color="#131415">
                See all
              </Link>
            </Stack>

            <Stack
              py={{ base: "2", md: "6" }}
              direction={{ base: "column", md: "row" }}
              spacing="4"
            >
              <Box
                flex="1"
                h={{ base: "200px", md: "350px" }}
                bgRepeat="no-repeat"
                bgSize="cover"
                bgPosition="center"
                bgImage="url(/images/rachit-tank-2cFZ_FB08UM-unsplash.jpg)"
              >
                <Stack
                  w="100%"
                  p={{ base: "4", md: "8" }}
                  h="100%"
                  spacing={{ base: "12", md: "4" }}
                >
                  <Heading flex="1" fontSize={{ base: "1.125rem", md: "24px" }}>
                    Electronics
                  </Heading>
                  <Button
                    alignSelf="flex-end"
                    variant="primary-outline"
                    bgColor="#fff"
                    px={{ base: "8", md: "12" }}
                    py={{ base: "4", md: "6" }}
                    border="none"
                    color="#000"
                  >
                    Shop now
                  </Button>
                </Stack>
              </Box>
              <Box
                flex="1"
                h={{ base: "200px", md: "350px" }}
                bgRepeat="no-repeat"
                bgSize="cover"
                bgPosition="center"
                bgImage="url(/images/ehimetalor-akhere-unuabona-okTqiC9Xqho-unsplash.jpg)"
              >
                <Stack
                  w="100%"
                  p={{ base: "4", md: "8" }}
                  h="100%"
                  spacing={{ base: "12", md: "4" }}
                >
                  <Heading flex="1" fontSize={{ base: "1.125rem", md: "24px" }}>
                    Fashion
                  </Heading>
                  <Button
                    alignSelf="flex-end"
                    variant="primary-outline"
                    bgColor="#fff"
                    px={{ base: "8", md: "12" }}
                    py={{ base: "4", md: "6" }}
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

      <Stack pt="4" borderTop="0.8px solid rgba(0, 0, 0, 0.24)" w="100%" />

      <Container
        maxW="100%"
        px={{ base: "2", md: "8" }}
        py={{ base: "0", md: "2" }}
      >
        <Stack
          bgRepeat="no-repeat"
          bgSize="cover"
          bgPosition="center"
          bgImage={{
            base: "url(/images/grow_mobile.png)",
            md: "url(/images/kamran-abdullayev-DvFrRwuyn88-unsplash.jpg)",
          }}
          px={{ base: "6", md: "11rem" }}
          py={{ base: "12", md: "10rem" }}
          spacing="2"
        >
          <Stack maxW={{ base: "100%", md: "48rem" }} mb="8" spacing="2">
            <Heading
              color="#fff"
              fontWeight="800"
              fontSize={{ base: "1.8rem", md: "64" }}
              mb="4"
            >
              Grow your <br /> business with Qua{" "}
            </Heading>
            <Text
              fontSize={{ base: "15px", md: "18px" }}
              color="#fff"
              opacity="87%"
              w={{ base: "100%", md: "548px" }}
            >
              Set up your brand store in an instant, sell to anyone, anywhere —
              Get the insights to grow with a simple dashboard to manage orders,
              shipping, and payments all in one place.
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
