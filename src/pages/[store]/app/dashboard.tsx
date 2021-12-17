import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { FunctionComponent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowDown, ArrowUp, Bag, Calendar, ChevronDown } from "react-iconly";

interface IInfoCard {
  bgColor?: string;
  rate?: number;
  amount: number | string;
  rateIsNegative: boolean;
  title: string;
  icon?: FunctionComponent<any>;
}

const InfoCard = (props: IInfoCard) => {
  return (
    <Box
      maxW="100%"
      border="0.5px solid rgba(0, 0, 0, 0.12)"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={{ base: "2.2rem", md: "4rem" }}
      borderRadius="12px"
      bgColor={props.bgColor ?? "#ffffff"}
    >
      <div>
        <Box display="flex" alignItems="center">
          <Heading
            as="h3"
            fontSize={{ base: "24px", md: "36px" }}
            fontWeight="400"
            lineHeight="43.57px"
          >
            {props.amount}
          </Heading>
          <Box display="flex" alignItems="center" ml="11px">
            <Icon
              as={() =>
                props.rateIsNegative ? (
                  <ArrowDown set="light" primaryColor="rgba(235, 87, 87, 1)" />
                ) : (
                  <ArrowUp set="light" primaryColor="rgba(2, 120, 87, 1)" />
                )
              }
            />

            {props.rate && (
              <Text
                color={
                  props.rateIsNegative
                    ? "rgba(235, 87, 87, 1)"
                    : "rgba(2, 120, 87, 1)"
                }
                fontSize="16px"
                fontWeight="500"
                lineHeight="19.36px"
              >
                {props.rate}%
              </Text>
            )}
          </Box>
        </Box>
        <Text
          fontSize="15px"
          lineHeight="18.15px"
          letterSpacing=".15px"
          fontWeight="400"
          opacity=".48"
        >
          {props.title}
        </Text>
      </div>
      {props.icon && (
        <Box
          h="60px"
          w="60px"
          ml="24px"
          borderRadius="50%"
          bgColor="rgba(255, 255, 255, 0.48)"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Icon boxSize={7} as={props.icon} />
        </Box>
      )}
    </Box>
  );
};

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
                Order ID:
              </Text>
              <Text fontSize="16px" fontWeight={{ base: "400", md: "600" }}>
                #1201
              </Text>
            </Flex>
            <Flex w="100%" justify="space-between">
              <Text display={{ base: "inline-block", md: "none" }}>
                Customer:
              </Text>
              <Text
                textAlign="right"
                fontSize="14px"
                fontWeight={{ base: "600", md: "600" }}
                mb={{ base: "2", md: "0" }}
              >
                Maria Luiz 0x9Ca9...43aA
              </Text>
            </Flex>
            <Flex w="100%" justifyContent="space-between">
              <Text display={{ base: "inline-block", md: "none" }}>
                Status:
              </Text>
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
            <Flex w="100%" justifyContent="space-between">
              <Text pr="1.5rem" display={{ base: "inline-block", md: "none" }}>
                Payment:
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

const Dashboard: NextPage = () => {
  const cards = [
    {
      bgColor: "#FEEECD",
      amount: 34,
      rateIsNegative: true,
      title: "Unfulfilled orders",
      icon: (props: any) => (
        <Bag set="light" {...props} primaryColor="rgba(251, 169, 4, 1)" />
      ),
    },
    {
      bgColor: "",
      rate: 12,
      amount: 20,
      rateIsNegative: true,
      title: "Total orders",
    },
    {
      bgColor: "",
      rate: 16,
      amount: 520,
      rateIsNegative: false,
      title: "Product views",
    },
    {
      bgColor: "",
      rate: 16,
      amount: "$1,898.44",
      rateIsNegative: false,
      title: "Total revenue",
    },
  ];

  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const handleChange = (e: any) => {
    setStartDate(e);
  };

  return (
    <StoreDashboardLayout>
      <Head>
        <title>Dashboard - Frowth</title>
      </Head>

      <Box px={{ base: "1rem", md: "4rem" }}>
        <Flex justifyContent="space-between" py="2rem" alignItems="center">
          <Heading
            as="h2"
            fontSize={{ base: "18px", md: "24px" }}
            fontWeight="500"
            color="#000"
          >
            Overview
          </Heading>

          <Popover matchWidth>
            <PopoverTrigger>
              <Button
                _hover={{
                  bg: "transparent",
                  borderColor: "rgb(255 255 255 / 48%)",
                }}
                display="flex"
                bgColor="#ffffff"
                border="1px solid rgba(0, 0, 0, 0.08)"
                color="black"
              >
                <Icon
                  as={() => <Calendar set="light" primaryColor="#000000" />}
                />
                <Text px="10px">Today</Text>
                <Icon
                  as={() => <ChevronDown set="light" primaryColor="#000000" />}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              w="fit-content"
              bgColor="transparent"
              border="none"
              boxShadow="none"
            >
              <PopoverArrow />
              <DatePicker selected={startDate} onChange={handleChange} inline />
            </PopoverContent>
          </Popover>
        </Flex>
        <Box>
          <Stack
            width="100%"
            // minW="max-content"
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
            spacing={{ base: "1rem", md: "24px" }}
          >
            {cards.map((card, index) => (
              <Box key={index}>
                <InfoCard {...card} key={index} />
              </Box>
            ))}
          </Stack>
        </Box>
        <Spacer py="6" />
        <hr />

        <Flex
          justifyContent="space-between"
          mt={{ base: "1.5rem", md: "2rem" }}
          mb={{ base: "1rem", md: "2rem" }}
          pt="1rem"
          alignItems="center"
        >
          <Heading
            as="h2"
            fontSize={{ base: "18px", md: "24px" }}
            fontWeight="500"
            color="#000"
          >
            Activity
          </Heading>
          <NextLink href={`/${router.query?.store}/app/orders`}>
            <Link>View all orders</Link>
          </NextLink>
        </Flex>

        <OrderGrid />
      </Box>
    </StoreDashboardLayout>
  );
};

export default Dashboard;
