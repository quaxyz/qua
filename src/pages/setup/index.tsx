import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import Api from "libs/api";
import Cookies from "js-cookie";
import {
  chakra,
  Container,
  Stack,
  Image,
  Link,
  Text,
  Input,
  Button,
  useBreakpointValue,
  Spacer,
} from "@chakra-ui/react";
import { FormGroup } from "components/form-group";
import { FcGoogle } from "react-icons/fc";
import { Wallet } from "react-iconly";
import { useGoogleLogin } from "react-google-login";
import { useMutation } from "react-query";
import { COOKIE_STORAGE_NAME, toBase64 } from "libs/cookie";

const useGoogleAuth = () => {
  const googleAuthMutation = useMutation(async (data: any) => {
    const { payload } = await Api().post("/auth/google", {
      googleId: data.tokenId,
    });

    if (!payload.token) {
      throw new Error("No token returned from server");
    }

    // store token in cookie
    Cookies.set(
      COOKIE_STORAGE_NAME,
      toBase64({ token: payload.token, email: data.email }),
      {
        expires: 365 * 10,
        secure: true,
      }
    );

    return payload.token;
  });

  const { loaded, signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    onSuccess: (resp) => googleAuthMutation.mutateAsync(resp),
  });

  return {
    ready: loaded,
    loading: googleAuthMutation.isLoading,
    signIn,
  };
};

const useWalletAuth = () => {
  // ask user to sign data and send to the backend
};

const useEmailAuth = () => {
  // send user email to backend to continue
};

const Page: NextPage = () => {
  const googleAuth = useGoogleAuth();

  return (
    <>
      <Head>
        <title>Setup store - Qua</title>
      </Head>

      <chakra.header
        borderBottom={{ base: "1px solid rgba(0, 0, 0, 0.08)", md: "none" }}
        pos={{ base: "relative", md: "fixed" }}
        top="0"
        w="100%"
        zIndex="2"
      >
        <Container
          maxW="100%"
          px={{ base: "4", md: "16" }}
          py={{ base: "4", md: "8" }}
        >
          <Stack direction="row" alignItems="center" justify="space-between">
            <Image
              src="/svg/qua_mark_white.svg"
              display={{ base: "none", md: "block" }}
              boxSize="70"
              alt="Qua logo"
            />
            <Image
              src="/svg/qua_mark_black.svg"
              boxSize="50"
              display={{ base: "block", md: "none" }}
              alt="Qua logo"
            />

            <Stack direction="row" spacing="8">
              <NextLink href="/" passHref>
                <Link>Log in</Link>
              </NextLink>
            </Stack>
          </Stack>
        </Container>
      </chakra.header>

      <Container maxW="100%" p="0" m="0">
        <Stack direction={{ base: "column", md: "row" }} align="center">
          <chakra.aside
            h={{ base: "80px", md: "100vh" }}
            w={{ base: "100%", md: "30vw" }}
            bgImage="url(/images/yash-bindra-NcMuToAOPUY-unsplash.jpg)"
            bgRepeat="no-repeat"
            bgSize="cover"
            bgPosition="center center"
            position="relative"
          />

          <chakra.main
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
            px={{ base: "8", md: "0" }}
            pt={{ base: "6", md: "0" }}
          >
            <Stack w={{ base: "100%", md: "60%" }} justify="center">
              <div>
                <Text fontSize={{ base: "1.125rem", md: "1.2rem" }}>
                  Welcome,
                </Text>
                <Text
                  as="span"
                  color="#131415"
                  fontWeight="600"
                  fontSize={{ base: "1.4rem", md: "1.8rem" }}
                >
                  Let&apos;s set you up!
                </Text>
              </div>

              <Stack
                py={{ base: "8", md: "12" }}
                spacing={{ base: "8", md: "12" }}
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "4", md: "8" }}
                >
                  <Button
                    flex={{ base: "block", md: "1" }}
                    size="lg"
                    variant="solid-outline"
                    color="#131415"
                    leftIcon={<FcGoogle fontSize="24px" />}
                    isDisabled={!googleAuth.ready}
                    isLoading={googleAuth.loading}
                    onClick={() => googleAuth.signIn()}
                  >
                    Sign up with Google
                  </Button>

                  <Button
                    flex={{ base: "block", md: "1" }}
                    size="lg"
                    variant="solid-outline"
                    color="#131415"
                    leftIcon={<Wallet set="bold" />}
                  >
                    Connect Wallet
                  </Button>
                </Stack>

                <Stack direction="row" align="center" spacing={4}>
                  <Spacer w="100%" h="1px" bgColor="rgba(19, 20, 21, 0.08)" />
                  <Text lineHeight="1px">OR</Text>
                  <Spacer w="100%" h="1px" bgColor="rgba(19, 20, 21, 0.08)" />
                </Stack>

                <Stack as="form" spacing={4}>
                  <FormGroup
                    id="email"
                    label="Email"
                    labelProps={{ variant: "flushed" }}
                  >
                    <Input
                      isRequired
                      type="email"
                      placeholder="shoo@mail.com"
                      variant="flushed"
                      size="lg"
                    />
                  </FormGroup>

                  <div>
                    <Button
                      variant="solid"
                      type="submit"
                      isFullWidth={useBreakpointValue({
                        base: true,
                        md: false,
                      })}
                    >
                      Send me a magic link
                    </Button>
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </chakra.main>
        </Stack>
      </Container>
    </>
  );
};

export default Page;
