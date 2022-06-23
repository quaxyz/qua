import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Api from "libs/api";
import {
  chakra,
  Container,
  Stack,
  Image,
  Text,
  Input,
  Button,
  useBreakpointValue,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { FormGroup } from "components/form-group";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "react-query";
import { useOath2Login } from "hooks/useOauth2Login";

const useGoogleAuth = () => {
  const toast = useToast();

  const url = React.useMemo(() => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "",
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: "https://www.googleapis.com/auth/userinfo.email",
      state: global.location?.href,
    }).toString();

    return `${url}?${params}`;
  }, []);

  const googleSignIn = useOath2Login({
    id: "google-login",
    url,
    redirect_origin:
      process.env.NODE_ENV !== "production"
        ? "http://localhost:8888"
        : "https://www.qua.xyz",
  });

  const googleAuthMutation = useMutation(
    async () => {
      const data = await googleSignIn();

      return await Api().post("/admin/setup/google", {
        code: data.code,
      });
    },
    {
      onError: (err: any) => {
        toast({
          title: "Error signing in with Google",
          description: err?.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return googleAuthMutation;
};

const useEmailAuth = () => {
  const toast = useToast();

  return useMutation(
    async (email: string) => {
      await Api().post("/admin/setup/email", {
        email,
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Login link sent",
          description: "Please check your email for the next steps",
          position: "top-right",
          status: "success",
        });
      },

      onError: (e: any) => {
        toast({
          title: "Error sending link",
          description: e.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );
};

const Page: NextPage = () => {
  const googleAuth = useGoogleAuth();
  const emailAuth = useEmailAuth();

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
          px={{ base: "4", md: "24" }}
          py={{ base: "1", md: "8" }}
        >
          <Stack direction="row" alignItems="center" justify="space-between">
            <Image
              src="/svg/qua_mark_white.svg"
              display={{ base: "none", md: "block" }}
              boxSize="50"
              alt="Qua logo"
            />
            <Image
              src="/svg/qua_mark_black.svg"
              boxSize="50"
              display={{ base: "block", md: "none" }}
              alt="Qua logo"
            />
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
                <Text
                  fontSize={{ base: "1.125rem", md: "1.125rem" }}
                  opacity="0.48"
                  color="#131415"
                >
                  Welcome,
                </Text>
                <Text
                  as="span"
                  color="#131415"
                  fontWeight="300"
                  fontSize={{ base: "1.4rem", md: "2rem" }}
                >
                  Setup your account
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
                    variant="solid-outline"
                    color="#131415"
                    size="lg"
                    leftIcon={<FcGoogle fontSize="24px" />}
                    isLoading={googleAuth.isLoading}
                    onClick={() => googleAuth.mutate()}
                  >
                    Sign up with Google
                  </Button>
                </Stack>

                <Stack direction="row" align="center" spacing={4}>
                  <Spacer w="100%" h="1px" bgColor="rgba(19, 20, 21, 0.08)" />
                  <Text lineHeight="1px">OR</Text>
                  <Spacer w="100%" h="1px" bgColor="rgba(19, 20, 21, 0.08)" />
                </Stack>

                <Stack
                  as="form"
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    emailAuth.mutate(e.target.email.value);
                  }}
                  spacing={4}
                >
                  <FormGroup
                    id="email"
                    label="Email"
                    labelProps={{ variant: "flushed" }}
                  >
                    <Input
                      isRequired
                      type="email"
                      id="email"
                      placeholder="shoo@mail.com"
                      variant="flushed"
                      size="lg"
                    />
                  </FormGroup>

                  <div>
                    <Button
                      variant="solid"
                      type="submit"
                      size="lg"
                      isLoading={emailAuth.isLoading}
                      isFullWidth={useBreakpointValue({
                        base: true,
                        md: false,
                      })}
                    >
                      Continue
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
