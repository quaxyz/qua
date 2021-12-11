import React from "react";
import Head from "next/head";
import {
  Stack,
  Box,
  Text,
  Flex,
  Button,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { Calendar, ChevronDown } from "react-iconly";

const OrderGrid = () => {
  return (
    <Box pb="3rem">
      <Stack
        direction="row"
        display={{ base: "none", md: "flex" }}
        mb="12px"
        p="8px 24px 8px 24px"
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
            mb="12px"
            direction={{ base: "column", md: "row" }}
            border="0.5px solid rgba(0, 0, 0, 0.12)"
            p="8px 24px 8px 24px"
          >
            <Flex w="100%">
              <Text pr="1.5rem" display={{ base: "inline-block", md: "none" }}>
                Order ID
              </Text>
              <Text fontSize="14px" fontWeight={{ base: "400", md: "600" }}>
                #1201
              </Text>
            </Flex>
            <Flex w="100%">
              <Text pr="1.5rem" display={{ base: "inline-block", md: "none" }}>
                Customer
              </Text>
              <Text fontSize="14px" fontWeight={{ base: "400", md: "600" }}>
                Maria Luiz 0x9Ca9...43aA
              </Text>
            </Flex>
            <Flex w="100%">
              <Text pr="1.5rem" display={{ base: "inline-block", md: "none" }}>
                Status
              </Text>
              <Text
                fontSize="14px"
                fontWeight="400"
                bgColor="rgba(205, 254, 240, 1)"
                color="rgba(2, 120, 87, 1)"
                lineHeight="1.5"
                borderRadius="8px"
                px="12px"
              >
                Unfulfilled
              </Text>
            </Flex>
            <Flex w="100%">
              <Text pr="1.5rem" display={{ base: "inline-block", md: "none" }}>
                Payment
              </Text>
              <Text
                fontSize="14px"
                fontWeight="400"
                bgColor="rgba(254, 238, 205, 1)"
                color="rgba(120, 81, 2, 1)"
                lineHeight="1.5"
                borderRadius="8px"
                px="12px"
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

      <Box px={{ base: "1rem", md: "2.5rem" }}>
        <Flex justifyContent="space-between" py="19.5px" alignItems="center">
          <Heading
            as="h1"
            fontSize="24px"
            fontWeight="600"
            lineHeight="29.05px"
          >
            All orders
          </Heading>
        </Flex>
        <OrderGrid />
      </Box>
    </StoreDashboardLayout>
  );
};

export default Orders;
