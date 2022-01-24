import { Box, chakra, Container, Heading, Input, Text } from "@chakra-ui/react";
import { FormGroup } from "components/form-group";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import WebsiteLayout from "components/layouts/website";

const Stores: NextPage = () => {
  const [formValue, setFormValue] = React.useState({
    name: "",
  });

  return (
    <WebsiteLayout>
      <Head>
        <title>P2P Stores - Qua</title>
      </Head>
      <chakra.header>
        <Box
          bgImage="url('/hedr-bg-store.svg')"
          bgPosition="center center"
          bgRepeat="no-repeat"
          bgSize={{ base: "cover", md: "80% 120%" }}
          mt={{ base: "2", md: "12" }}
        >
          <Container maxW="100%" py="20" centerContent>
            <Box maxW={{ base: "100%", md: "48rem" }} mb="8">
              <Heading
                textAlign="center"
                color="#000000"
                size="lg"
                fontSize={{ base: "1.5rem", md: "3rem" }}
                mb="4"
              >
                Shop from the best stores of your dreams
              </Heading>
              <Text fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
                Browse and shop directly from a collection of businesses{" "}
              </Text>
            </Box>

            <Box maxW="100%">
              <FormGroup id="name">
                <Input
                  style={{
                    width: "36.25rem",
                    height: "4rem",
                    backgroundColor: "#fff",
                  }}
                  type="search"
                  placeholder="Search: “store name”, “industry”, “location”, “product name” ..."
                  variant="outline"
                  value={formValue.name}
                  onChange={(e) =>
                    setFormValue({ ...formValue, name: e.target.value })
                  }
                />
              </FormGroup>
            </Box>
          </Container>
        </Box>
      </chakra.header>
    </WebsiteLayout>
  );
};

export default Stores;
