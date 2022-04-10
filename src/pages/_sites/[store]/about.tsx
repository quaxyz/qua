import React from "react";
import prisma from "libs/prisma";
import type { GetServerSideProps, GetStaticProps } from "next";
import {
  Box,
  chakra,
  Container,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer";
import { mapSocialLink } from "libs/utils";
import { defaultCategories } from "libs/constants";
import { withSsrSession } from "libs/session";

const Page = ({ store }: any) => {
  return (
    <>
      <chakra.header>
        <Box
          bgImage={`linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),url('${
            store.image?.url ||
            "/images/fakurian-design-GJKx5lhwU3M-unsplash.jpg"
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
                fontSize={{ base: "xs", md: "sm" }}
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
                  defaultCategories.find((c) => c.value === store.category)
                    ?.label
                }
              </Text>
              <Heading
                as="h1"
                color="#fff"
                fontSize={{ base: "2rem", md: "4rem" }}
              >
                {store.title}
              </Heading>
            </Box>

            <Stack direction="row" spacing={3}>
              <Link
                href={`mailto:${store.email}`}
                color="#fff"
                textTransform="uppercase"
                fontSize="sm"
                isExternal
              >
                email
              </Link>

              {Object.entries(store.socialLinks || {})
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
        <Text>{store.about}</Text>
        <Box spacing="2.4rem" mt="12">
          <Text
            fontSize="sm"
            opacity="36%"
            color="#000"
            textTransform="uppercase"
            pb="2"
          >
            Verified owner
          </Text>
        </Box>
        {store.location && (
          <Stack spacing="2" mt="8">
            <Text
              fontSize="sm"
              opacity="36%"
              color="#000"
              textTransform="uppercase"
            >
              Store Location:
            </Text>
            <Text>{store.location}</Text>
          </Stack>
        )}
      </Container>
    </>
  );
};

export const getStaticPaths = async () => {
  const stores = await prisma.store.findMany({
    select: {
      name: true,
    },
  });

  return {
    paths: stores.map((store) => ({ params: { store: store.name as string } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.store) {
    return {
      notFound: true,
    };
  }

  const store = await prisma.store.findUnique({
    where: { name: params.store as string },
    select: {
      name: true,
      category: true,
      title: true,
      email: true,
      socialLinks: true,
      about: true,
      location: true,
      image: {
        select: {
          url: true,
        },
      },
    },
  });
  if (!store) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      store,
      layoutProps: {
        title: `About - ${store.name}`,
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
