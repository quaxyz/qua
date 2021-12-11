import { Container, Stack, Box } from '@chakra-ui/react';
import Head from 'next/head';
import type { NextPage } from 'next';
import StoreDashboardLayout from 'components/layouts/store-dashboard';

const Dashboard: NextPage = () => {
  return (
    <StoreDashboardLayout>
      <Head>
        <title>Dashboard - Frowth</title>
      </Head>

      <Box p="1rem">
        <h2>interesting stuff </h2>
        <Stack direction={{ base: 'column', md: 'row' }} spacing="24px">
          <Box width="100%" minW="40px" h="40px" bg="yellow.200">
            1
          </Box>
          <Box width="100%" minW="40px" h="40px" bg="tomato">
            2
          </Box>
          <Box width="100%" minW="40px" h="40px" bg="pink.100">
            3
          </Box>
          <Box width="100%" minW="40px" h="40px" bg="blue.100">
            3
          </Box>
        </Stack>
      </Box>
    </StoreDashboardLayout>
  );
};

export default Dashboard;
