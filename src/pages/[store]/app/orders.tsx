import {
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import Head from "next/head";
import React from "react";
import { Search } from "react-iconly";

const OrderGrid = () => {
  return (
    <Box pb="3rem">
      <Stack
        direction="row"
        display={{ base: "none", md: "flex" }}
        mb="8px"
        p="2rem"
      >
        <Flex w="100%">
          <Text>Order ID</Text>
        </Flex>
        <Flex w="100%">
          <Text>Customer</Text>
        </Flex>
        <Flex w="100%">
          <Text>Status</Text>
        </Flex>
        <Flex w="100%">
          <Text>Payment</Text>
        </Flex>
      </Stack>
      {[1, 2, 3, 4, 5].map((index) => (
        <React.Fragment key={index}>
          <Stack
            mb="1rem"
            direction={{ base: "column", md: "row" }}
            border="0.5px solid rgba(0, 0, 0, 0.12)"
            p="1.4rem"
            alignItems="center"
          >
            <Flex w="100%" justify="space-between">
              <Text display={{ base: "inline-block", md: "none" }}>
                Order ID
              </Text>
              <Text fontSize="16px" fontWeight={{ base: "400", md: "600" }}>
                #1201
              </Text>
            </Flex>
            <Flex w="100%" justify="space-between">
              <Text display={{ base: "inline-block", md: "none" }}>
                Customer
              </Text>
              <Text
                fontSize="14px"
                textAlign="right"
                fontWeight={{ base: "600", md: "600" }}
                mb={{ base: "2", md: "0" }}
              >
                Maria Luiz 0x9Ca9...43aA
              </Text>
            </Flex>
            <Flex w="100%" justify="space-between">
              <Text display={{ base: "inline-block", md: "none" }}>Status</Text>
              <Text
                fontSize="14px"
                fontWeight="500"
                bgColor="rgba(254, 238, 205, 1)"
                color="rgba(120, 81, 2, 1)"
                lineHeight="1.5"
                borderRadius="8px"
                px="12px"
                py="4px"
                textAlign="center"
              >
                Unfulfilled
              </Text>
            </Flex>
            <Flex w="100%" justify="space-between">
              <Text display={{ base: "inline-block", md: "none" }}>
                Payment
              </Text>
              <Text
                fontSize="14px"
                fontWeight="500"
                bgColor="rgba(205, 254, 240, 1)"
                color="rgba(2, 120, 87, 1)"
                lineHeight="1.5"
                borderRadius="8px"
                px="12px"
                py="4px"
                textAlign="center"
              >
                Paid
              </Text>
            </Flex>
          </Stack>
        </React.Fragment>
      ))}
    </Box>
  );
};

const Orders = () => {
  return (
    <StoreDashboardLayout>
      <Head>
        <title>Orders - Frowth</title>
      </Head>

      <Box px={{ base: "1rem", md: "4rem" }}>
        <Flex justifyContent="space-between" py="2rem" alignItems="center">
          <Heading
            as="h2"
            fontSize={{ base: "18px", md: "24px" }}
            fontWeight="500"
            color="#000"
          >
            All orders
          </Heading>
        </Flex>

        <Box maxW="403px" pt="5px" pb={{ base: "28px", md: "45px" }}>
          <InputGroup>
            <InputLeftElement
              fontSize="1rem"
              pointerEvents="none"
              children={
                <Icon
                  boxSize="10px"
                  as={() => <Search set="light" primaryColor="#0E0F0F" />}
                />
              }
            />
            <Input
              type="text"
              color="rgba(180, 182, 184, 1)"
              placeholder="Search"
            />
          </InputGroup>
        </Box>
        <OrderGrid />
      </Box>
    </StoreDashboardLayout>
  );
};

export default Orders;
