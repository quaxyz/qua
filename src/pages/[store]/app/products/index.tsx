import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Image,
  Text
} from '@chakra-ui/react'
import StoreDashboardLayout from 'components/layouts/store-dashboard'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const Products = () => {
  const router = useRouter()

  return (
    <StoreDashboardLayout>
      <Head>
        <title>Products - Frowth</title>
      </Head>

      <Container maxW="100%">
        <chakra.header>
          <Flex justify="space-between" py="8" px="4rem">
            <Heading as="h2" fontSize="24px" fontWeight="500" color="#000">
              Products
            </Heading>

            <NextLink
              href={`/${router?.query.store}/app/products/new`}
              passHref
            >
              <Button>New Product</Button>
            </NextLink>
          </Flex>
        </chakra.header>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt="20rem"
        >
          <Image
            src="/svg/add.svg"
            alt="Add Icon"
            layout="fixed"
            width={100}
            height={100}
            mb="4"
          />
          <Text fontSize="xl" fontWeight="bold" color="#000">
            Add and manage your products
          </Text>
          <Text fontSize="lg">
            You can add products and manage your pricing here.
          </Text>
        </Box>
      </Container>
    </StoreDashboardLayout>
  )
}

export default Products
