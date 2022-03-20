import React from "react";
import Api from "libs/api";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Link from "./link";
import { Wallet } from "react-iconly";
import { FcGoogle } from "react-icons/fc";
import { FormGroup } from "./form-group";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { providers } from "ethers";
import { injected, switchNetwork } from "libs/wallet";
import { useGoogleLogin } from "react-google-login";
import { useMutation, useQueryClient } from "react-query";
import { ConnectModal } from "./wallet";

export const useGoogleAuth = ({ onClose }: any) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const googleAuthMutation = useMutation(
    async (data: any) => {
      await Api().post("/login/google", {
        token: data.tokenId,
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

  const { loaded, signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    onSuccess: (resp) => googleAuthMutation.mutateAsync(resp),
    onFailure: (err) => {
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

export const useWalletAuth = ({ onClose }: any) => {
  const toast = useToast();
  const queryClient = useQueryClient();
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

const OptionsModal = ({ options, isOpen, onClose }: any) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton
          rounded="full"
          bg="rgba(0, 0, 0, 0.02)"
          size="lg"
          fontSize="sm"
          top={6}
          right={5}
        />
        <ModalHeader align="center" color="black" py={8}>
          My Account
        </ModalHeader>

        <ModalBody py={5}>
          <Stack direction="column" spacing={2}>
            {options.map((option: any, idx: number) => (
              <Link
                key={idx}
                href={option.href}
                as={Button}
                size="lg"
                variant="solid-outline"
                isFullWidth
                onClick={() => {
                  if (option.onClick) option.onClick();
                  onClose();
                }}
              >
                {option.label}
              </Link>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const LoginModal = ({ isOpen, onClose }: any) => {
  const googleAuth = useGoogleAuth({ onClose });
  const walletAuth = useWalletAuth({ onClose });

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
                  isDisabled={!googleAuth.ready}
                  isLoading={googleAuth.loading}
                  onClick={() => googleAuth.signIn()}
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

export const AccountMenu = ({ children, options, isLoggedIn }: any) => {
  const accountModal = useDisclosure();
  const loginModal = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () =>
          isLoggedIn ? accountModal.onOpen() : loginModal.onOpen(),
      })}

      <OptionsModal
        isOpen={accountModal.isOpen}
        onClose={accountModal.onClose}
        options={options}
      />

      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.onClose} />
    </>
  );
};
