import {
  Button,
  chakra,
  Container,
  Heading,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CostSummary } from "components/cost-summary";
import CustomerLayout from "components/layouts/customer-dashboard";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Payment: NextPage = () => {
  const router = useRouter();
  const [value, setValue] = React.useState("1");

  return (
    <CustomerLayout title="Shipping">
      <chakra.main>
        {/* <Container maxW="container.lg" py={14}> */}
        <Container
          maxW={{ base: "100%", md: "container.lg" }}
          borderLeft="0.5px solid rgba(0, 0, 0, 8%)"
          borderRight="0.5px solid rgba(0, 0, 0, 8%)"
          height="100vh"
          centerContent
        >
          <Stack
            w="100%"
            px={{ base: "2", md: "24" }}
            overflowY="scroll"
            height="100vh"

            // pb={{ base: "12", md: "0" }}
          >
            <Stack spacing="4">
              <chakra.header pt={{ base: "8", md: "16" }}>
                <Stack direction="row" justify="space-between">
                  <Heading
                    as="h2"
                    fontSize={{ base: "lg", md: "1xl" }}
                    color="#000"
                  >
                    Shipping Details
                  </Heading>

                  <NextLink href={`/${router?.query.store}/shipping`}>
                    <Link>Change</Link>
                  </NextLink>
                </Stack>
              </chakra.header>

              <Stack
                spacing={2}
                py={{ base: "4", md: "6" }}
                borderTop="0.5px solid rgba(0, 0, 0, 8%)"
                borderBottom="0.5px solid rgba(0, 0, 0, 8%)"
              >
                <Heading as="h4" size="md">
                  Maria Liuz
                </Heading>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  18 Samson Street, Lekki Phase I, Lagos
                </Text>
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  +1 (223) 123-1234
                </Text>
              </Stack>
            </Stack>

            <Stack spacing="4">
              <chakra.header pt={{ base: "8", md: "8" }}>
                <Stack direction="row" justify="space-between">
                  <Heading
                    as="h2"
                    fontSize={{ base: "lg", md: "1xl" }}
                    color="#000"
                  >
                    Delivery Method
                  </Heading>

                  <NextLink href={`/${router?.query.store}/shipping`}>
                    <Link>Change</Link>
                  </NextLink>
                </Stack>
              </chakra.header>

              <Stack
                spacing={2}
                py={{ base: "4", md: "4" }}
                borderTop="0.5px solid rgba(0, 0, 0, 8%)"
                borderBottom="0.5px solid rgba(0, 0, 0, 8%)"
              >
                <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                  Door Delivery
                </Text>
              </Stack>
            </Stack>

            <chakra.form>
              <Stack py="4">
                <Heading
                  as="h2"
                  py={{ base: "4", md: "4" }}
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Payment Method
                </Heading>

                <RadioGroup onChange={setValue} value={value}>
                  <Stack spacing={{ base: "4", md: "6" }}>
                    <Radio size="lg" value="1">
                      Pay now with Crypto (Recomended)
                    </Radio>
                    <Radio size="lg" value="2">
                      Contact seller for payment option
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>

              <CostSummary />
              <NextLink href={`/${router?.query.store}/payment`} passHref>
                <Button size="lg" variant="solid" width="100%">
                  Place my Order
                </Button>
              </NextLink>
            </chakra.form>
          </Stack>
        </Container>
      </chakra.main>
      {/* </Container> */}
    </CustomerLayout>
  );
};

export default Payment;
