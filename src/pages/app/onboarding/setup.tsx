import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { chakra, Container, Stack, Image } from "@chakra-ui/react";
import { Wallet } from "components/wallet";

const OnboardSetup: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Setup store - Qua</title>
      </Head>

      <chakra.main>
        <chakra.header borderBottom="1px" borderColor="rgba(0, 0, 0, 0.08)">
          <Container maxW="container.xl" py={6}>
            <Stack direction="row" alignItems="center" justify="space-between">
              <Image src="/logo.svg" alt="Qua logo" />

              <Stack direction="row" spacing={3}>
                <Wallet />
              </Stack>
            </Stack>
          </Container>
        </chakra.header>
      </chakra.main>
    </div>
  );
};

export default OnboardSetup;
