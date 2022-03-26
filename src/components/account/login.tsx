import React from "react";
import Api from "libs/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Stack,
  ModalBody,
  Button,
  Spacer,
  Input,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { FormGroup } from "components/form-group";
import { ConnectModal } from "components/wallet";
import { providers } from "ethers";
import { injected, switchNetwork } from "libs/wallet";
import { Wallet } from "react-iconly";
import { FcGoogle } from "react-icons/fc";
import { useQueryClient, useMutation } from "react-query";
import { useCustomerData } from "hooks/auth";
import { useRouter } from "next/router";
import { useOath2Login } from "hooks/useOauth2Login";

const useGoogleAuth = ({ onClose }: any) => {
  const queryClient = useQueryClient();
  const router = useRouter();
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
      state: JSON.stringify({
        store: router.query.store,
        path: global.location?.href,
      }),
    }).toString();

    return `${url}?${params}`;
  }, [router.query.store]);

  const googleSignIn = useOath2Login({
    id: "google-login",
    url,
    redirect_origin: "http://localhost:8888",
  });

  const googleAuthMutation = useMutation(
    async () => {
      const data = await googleSignIn();

      // redirect to details page
      await Api().post("/login/google", {
        code: data.code,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("customer-data");
        onClose();
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

const useWalletAuth = ({ onClose }: any) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [pending, setPending] = React.useState<boolean>(false);
  const { activate, library, account } = useWeb3React();
  const connectModal = useDisclosure();

  const walletAuthMutation = useMutation(
    async (account?: string) => {
      if (!account) {
        throw new Error("Connect wallet to continue");
      }
      // ask user to sign message
      let provider: providers.Web3Provider = library;
      const signer = provider.getSigner(account!);

      const message = "Please sign this message to confirm you own this wallet";
      const sig = await signer.signMessage(message);

      console.log("Sign", { sig, address: account });

      // redirect to details page
      await Api().post("/login/wallet", {
        address: account,
        sig,
        message,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("customer-data");
        onClose();
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
    if (walletAuthMutation.isIdle) {
      walletAuthMutation.mutate(account);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, walletAuthMutation.isIdle]);

  return {
    isLoading: pending || walletAuthMutation.isLoading,
    isModalOpen: connectModal.isOpen,
    onModalClose: connectModal.onClose,
    onModalOpen: connectModal.onOpen,
    activate: tryActivate,
  };
};

const useEmailAuth = ({ onClose }: any) => {
  const toast = useToast();
  const router = useRouter();

  return useMutation(
    async (email: string) => {
      await Api().post("/login/email", {
        email,
        redirectTo: router.asPath,
      });
    },
    {
      onSuccess: () => {
        onClose();
        toast({
          title: "Login link sent",
          description: "Please check your email for the next steps",
          position: "top-right",
          status: "success",
        });
      },
    }
  );
};

export const LoginModal = ({ isOpen, onClose }: any) => {
  const googleAuth = useGoogleAuth({ onClose });
  const walletAuth = useWalletAuth({ onClose });
  const emailAuth = useEmailAuth({ onClose });

  return (
    <>
      <Modal isCentered size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded="0px">
          <ModalHeader border="none" p="0">
            <Stack
              bgRepeat="no-repeat"
              bgSize="cover"
              bgPosition="center"
              bgImage="url(/images/yash-bindra-NcMuToAOPUY-unsplash.jpg)"
              h="100px"
              w="100%"
            />
            <Stack direction="column" px="16" pt="8">
              <Text
                color="#131415"
                fontWeight="300"
                fontSize={{ base: "1.4rem", md: "1.8rem" }}
              >
                Sign in to your account
              </Text>
            </Stack>
          </ModalHeader>

          <ModalBody py={5} px="16">
            <Stack
              direction="column"
              py={{ base: "8", md: "8" }}
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
          </ModalBody>
        </ModalContent>
      </Modal>

      <ConnectModal
        isOpen={walletAuth.isModalOpen}
        isPending={walletAuth.isLoading}
        onClose={walletAuth.onModalClose}
        onActivate={walletAuth.activate}
      />
    </>
  );
};

export const AuthButton = (props: any) => {
  const customerData = useCustomerData();
  const loginModal = useDisclosure();

  return (
    <>
      {customerData?.data?.user ? (
        <Button {...props} />
      ) : (
        <Button {...props} onClick={loginModal.onOpen} />
      )}

      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.onClose} />
    </>
  );
};
