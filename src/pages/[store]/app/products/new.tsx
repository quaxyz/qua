import { Button, chakra, Container, Flex, Heading } from '@chakra-ui/react'
import StoreDashboardLayout from 'components/layouts/store-dashboard'
import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

const New: NextPage = () => {
  return (
    <StoreDashboardLayout>
      <Head>
        <title>Add product - Qua</title>
      </Head>
      <Container>
        <chakra.header>
          <Flex justify="space-between" py="8">
            <Heading as="h2" fontSize="24px" fontWeight="500" color="#000">
              Add Product
            </Heading>
            <Button>Publish</Button>
          </Flex>
        </chakra.header>
      </Container>
    </StoreDashboardLayout>
  )
}

export default New
