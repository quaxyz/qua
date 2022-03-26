import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import Api from "libs/api";
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
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FormGroup } from "components/form-group";
import { FcGoogle } from "react-icons/fc";
import { Wallet } from "react-iconly";
import { ConnectModal } from "components/wallet";
import { useMutation } from "react-query";
import { useGoogleLogin } from "react-google-login";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { injected, switchNetwork } from "libs/wallet";

export const useGoogleAuth = () => {
  const toast = useToast();
  const googleAuthMutation = useMutation(
    async (data: any) => {
      // automatically redirect to details page
      await Api().post("/setup/auth/google", {
        token: data.tokenId,
      });
    },
    {
      onError: (err) => {
        toast({
          title: "Error Signing up",
          description: "Something went wrong authenicating with Google",
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  const { loaded, signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    onSuccess: (resp) => googleAuthMutation.mutateAsync(resp),
    onFailure: (err) => {
      console.log(err);
      toast({
        title: "Error Signing up",
        description: "Something went wrong authenicating with Google",
        position: "bottom-right",
        status: "error",
      });
    },
  });

  return {
    ready: loaded,
    loading: googleAuthMutation.isLoading,
    signIn,
  };
};

export const useWalletAuth = () => {
  // ask user to sign data and send to the backend
  const toast = useToast();
  const [pending, setPending] = React.useState<boolean>(false);
  const { activate, library, account } = useWeb3React();
  const connectModal = useDisclosure();

  const walletAuthMutation = useMutation(async (account: string) => {
    // ask user to sign message
    let provider: providers.Web3Provider = library;
    const signer = provider.getSigner(account!);

    const message = "Please sign this message to confirm you own this wallet";
    const sig = await signer.signMessage(message);

    console.log("Sign", { sig, address: account });

    // redirect to details page
    await Api().post("/setup/auth/wallet", {
      address: account,
      sig,
      message,
    });
  });

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
    if (!account) return;
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
  // send user email to backend to continue
};

const Page: NextPage = () => {
  const googleAuth = useGoogleAuth();
  const walletAuth = useWalletAuth();

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
                    isDisabled={!googleAuth.ready}
                    isLoading={googleAuth.loading}
                    onClick={() => googleAuth.signIn()}
                  >
                    Sign up with Google
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
                      size="lg"
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
