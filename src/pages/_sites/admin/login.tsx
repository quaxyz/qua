import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Api from "libs/api";
import _capitalize from "lodash.capitalize";
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
  useDisclosure,
  Link,
  toast,
} from "@chakra-ui/react";
import { FormGroup } from "components/form-group";
import { FcGoogle } from "react-icons/fc";
import { Wallet } from "react-iconly";
import { ConnectModal } from "components/wallet";
import { useMutation, useQueryClient } from "react-query";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { injected, switchNetwork } from "libs/wallet";
import { useOath2Login } from "hooks/useOauth2Login";
import { useRouter } from "next/router";

const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

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

      return await Api().post("/admin/login/google", {
        code: data.code,
      });
    },
    {
      onSuccess: async ({ payload }) => {
        await queryClient.invalidateQueries("user");
        router.push(`/${payload.store}/settings`);
      },

      onError: (err: any) => {
        toast({
          title: "Error login in",
          description: err?.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return googleAuthMutation;
};

const useWalletAuth = () => {
  const toast = useToast();
  const [pending, setPending] = React.useState<boolean>(false);
  const { activate, library, account } = useWeb3React();
  const connectModal = useDisclosure();

  const walletAuthMutation = useMutation(
    async (account: string) => {
      // ask user to sign message
      let provider: providers.Web3Provider = library;
      const signer = provider.getSigner(account!);

      const message = "Please sign this message to confirm you own this wallet";
      const sig = await signer.signMessage(message);

      console.log("Sign", { sig, address: account });

      return await Api().post("/admin/login/wallet", {
        address: account,
        sig,
        message,
      });
    },
    {
      onError: (err: any) => {
        toast({
          title: "Error login in",
          description: err?.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  const tryActivate = async (connector?: any) => {
    if (!connector) return;
    setPending(true);

    // activate wallet
    try {
      await activate(connector, undefined, true);
    } catch (error) {
      if (connector === injected && error instanceof UnsupportedChainIdError) {
        await switchNetwork();
        await activate(injected, (err) => {
          toast({
            title: "Error connecting account",
            description: err.message,
            position: "bottom-right",
            status: "error",
          });
        });
      }
    } finally {
      setPending(false);
      connectModal.onClose();
    }
  };

  React.useEffect(() => {
    if (!account || walletAuthMutation.isLoading) return;
    walletAuthMutation.mutate(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return {
    isLoading: pending || walletAuthMutation.isLoading,
    isModalOpen: connectModal.isOpen,
    onModalClose: connectModal.onClose,
    onModalOpen: connectModal.onOpen,
    activate: tryActivate,
  };
};

const useEmailAuth = () => {
  const toast = useToast();

  return useMutation(
    async (email: string) => {
      await Api().post("/admin/login/email", {
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
  const walletAuth = useWalletAuth();
  const emailAuth = useEmailAuth();

  return (
    <>
      <Head>
        <title>Login to your store</title>
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
                  Welcome back
                </Text>
                <Text
                  as="span"
                  color="#131415"
                  fontWeight="600"
                  fontSize={{ base: "1.4rem", md: "1.8rem" }}
                >
                  Log in to your store
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
                    isLoading={googleAuth.isLoading}
                    leftIcon={<FcGoogle fontSize="24px" />}
                    onClick={() => googleAuth.mutate()}
                  >
                    Continue with Google
                  </Button>

                  <Button
                    flex={{ base: "block", md: "1" }}
                    variant="solid-outline"
                    color="#131415"
                    size="lg"
                    leftIcon={<Wallet set="bold" />}
                    isLoading={walletAuth.isLoading}
                    onClick={() => walletAuth.onModalOpen()}
                  >
                    Connect Wallet
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
                      id="email"
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
                      size="lg"
                      isLoading={emailAuth.isLoading}
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
      <ConnectModal
        isOpen={walletAuth.isModalOpen}
        isPending={walletAuth.isLoading}
        onClose={walletAuth.onModalClose}
        onActivate={walletAuth.activate}
      />
    </>
  );
};

export default Page;
