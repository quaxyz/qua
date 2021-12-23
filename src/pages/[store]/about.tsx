import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Link,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { truncateAddress } from "libs/utils";
import type { NextPage } from "next";
import React from "react";
import { FiExternalLink } from "react-icons/fi";

const AboutStore: NextPage = () => {
  return (
    <CustomerLayout title="About">
      <chakra.header>
        <Box
          bgImage="linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),url('/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize="cover"
          maxW="100%"
        >
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
                fontSize={{ base: "sm", md: "md" }}
                textTransform="uppercase"
                fontWeight="bold"
                color="#fff"
                background="rgba(255, 255, 255, 12%)"
                py="2"
                px="4"
                mb="2"
                borderRadius="50"
              >
                Fashion
              </Text>
              <Heading
                as="h1"
                color="#fff"
                fontSize={{ base: "2rem", md: "4rem" }}
              >
                Shoe Show
              </Heading>
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
              </Link>{" "}
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
          width={{ base: "140px", md: "16%" }}
          p={{ base: "1.2rem", md: "2.4rem" }}
          mt={{ base: "-2rem", md: "-4rem" }}
          ml={{ base: "1rem", md: "16rem" }}
          display="flex"
          justifyContent="center"
        >
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            color="#000"
          >
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
        <Text>
          shooshow is a collection showcasing of the best industry leading sport
          wears.
        </Text>
        <Box spacing="2.4rem" mt="12">
          <Text
            fontSize="sm"
            opacity="36%"
            color="#000"
            textTransform="uppercase"
            pb="2"
          >
            Verified owner address
          </Text>
          <Button
            as={Link}
            href={`#`}
            rightIcon={<FiExternalLink />}
            size="md"
            variant="solid-outline"
            isExternal
          >
            {truncateAddress(
              "0x1F86E192e75BFEdC227F148f67a88B38Ab14687c" || "",
              6
            )}
          </Button>
        </Box>
        <Stack spacing="2" mt="8">
          <Text
            fontSize="sm"
            opacity="36%"
            color="#000"
            textTransform="uppercase"
          >
            Store Location:
          </Text>
          <Text>100 Sansom St, San Francisco</Text>
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default AboutStore;
