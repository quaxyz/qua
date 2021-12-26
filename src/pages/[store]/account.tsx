import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { truncateAddress } from "libs/utils";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const Account: NextPage = () => {
  const router = useRouter();

  return (
    <CustomerLayout title="Account">
      <Container
        maxW={{ base: "100%", md: "container.xl" }}
        px={{ base: "4", md: "16" }}
        py={{ base: "4", md: "16" }}
      >
        <Text>Welcome,</Text>
        <Stack
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
        >
          <Heading
            as="h3"
            color="#000"
            mt={{ base: "1", md: "2" }}
            fontSize={{ base: "2xl", md: "4xl" }}
          >
            Maria Liuz
          </Heading>
          <Box
            cursor="pointer"
            bg=" rgba(0, 0, 0, 0.04)"
            rounded="50px"
            height="100%"
            px="0.8rem"
            py="0.4rem"
            display="inline-block"
            userSelect="none"
            textAlign="center"
          >
            <Text fontSize={{ base: "sm", md: "md" }}>
              {truncateAddress(
                "0x1F86E192e75BFEdC227F148f67a88B38Ab14687c" || "",
                6
              )}
            </Text>
          </Box>
        </Stack>

        <Spacer
          my={{ base: "4", md: "12" }}
          height="1px"
          bg="rgba(0, 0, 0, 0.08)"
        />

        <Stack
          w="100%"
          pr={{ base: "0", md: "2.8rem" }}
          spacing={{ base: "2", md: "4" }}
        >
          <Heading as="h3" fontSize={{ base: "lg", md: "2xl" }}>
            Account Details
          </Heading>

          <chakra.section>
            <Text>*Form fields*</Text>

            <Button variant="solid-disabled" px="12" py="6" mt="4rem">
              Save Details
            </Button>
          </chakra.section>
        </Stack>
      </Container>
    </CustomerLayout>
  );
};

export default Account;
