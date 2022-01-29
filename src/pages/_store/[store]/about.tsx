import React from "react";
import prisma from "libs/prisma";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
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
import { mapSocialLink, truncateAddress } from "libs/utils";
import { FiExternalLink } from "react-icons/fi";
import { defaultCategories } from "libs/constants";

const Page: NextPage = ({ storeDetails }: any) => {
  const router = useRouter();

  return (
    <CustomerLayout title={`About ${router.query.store}`}>
      <chakra.header>
        <Box
          bgImage={`linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),url('${
            storeDetails.image?.url ||
            "/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg"
          }')`}
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
                {
                  defaultCategories.find(
                    (c) => c.value === storeDetails.category
                  )?.label
                }
              </Text>
              <Heading
                as="h1"
                color="#fff"
                fontSize={{ base: "2rem", md: "4rem" }}
              >
                {storeDetails.title}
              </Heading>
            </Box>

            <Stack direction="row" spacing={2}>
              {Object.entries(storeDetails.socialLinks || {})
                .filter(([_, value]: any) => value.length)
                .map(([social, link]: any) => (
                  <Link
                    key={social}
                    href={mapSocialLink(social, link)}
                    color="#fff"
                    textTransform="uppercase"
                    fontSize="sm"
                    isExternal
                  >
                    {social}
                  </Link>
                ))}
            </Stack>
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
        <Text>{storeDetails.about}</Text>
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
            href={`https://etherscan.io/address/${storeDetails.owner}`}
            rightIcon={<FiExternalLink />}
            size="md"
            variant="solid-outline"
            isExternal
          >
            {truncateAddress(storeDetails.owner || "", 6)}
          </Button>
        </Box>
        {storeDetails.location && (
          <Stack spacing="2" mt="8">
            <Text
              fontSize="sm"
              opacity="36%"
              color="#000"
              textTransform="uppercase"
            >
              Store Location:
            </Text>
            <Text>{storeDetails.location}</Text>
          </Stack>
        )}
      </Container>
    </CustomerLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = (params?.store || "") as string;

  const storeDetails = await prisma.store.findUnique({
    where: { name: store },
    include: {
      image: {
        select: {
          url: true,
        },
      },
    },
  });

  if (!storeDetails) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      storeDetails: JSON.parse(JSON.stringify(storeDetails)),
    },
  };
};

export default Page;
