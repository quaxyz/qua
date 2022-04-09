import React from "react";
import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { injected, SUPPORTED_WALLETS } from "libs/wallet";

export const ConnectModal = ({
  isOpen,
  isPending,
  onClose,
  onActivate,
}: any) => {
  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent rounded="0px" px={[2, 10]}>
        {onClose && (
          <ModalCloseButton
            rounded="full"
            bg="rgba(0, 0, 0, 0.02)"
            size="lg"
            fontSize="sm"
            top={[3, 5]}
            right={[3, 10]}
          />
        )}
        <ModalHeader borderBottom="none" color="black" px={[3, 6]} py={[4, 8]}>
          Connect your wallet
        </ModalHeader>

        <ModalBody px={[3, 6]} py={[2, 5]} mb={8}>
          <Text>
            Sign in with one of your crypto wallet providers or create a new
            wallet.{" "}
            <Link fontSize="sm" isExternal href="https://metamask.io/">
              What is a wallet?
            </Link>
          </Text>

          <Stack direction="column" spacing={4} my={10} alignItems="center">
            {Object.keys(SUPPORTED_WALLETS).map((walletKey: string) => {
              // @ts-ignore
              const isMetamask = global.ethereum && global.ethereum.isMetaMask;
              const wallet = SUPPORTED_WALLETS[walletKey];

              // overwrite injected when needed
              if (wallet.connector === injected) {
                // don't show injected if there's no injected provider
                // @ts-ignore
                if (!(global.web3 || global.ethereum)) {
                  if (wallet.name === "MetaMask") {
                    return (
                      <Button
                        key="metamask-install"
                        leftIcon={
                          <Image
                            src="/wallets/metamask.png"
                            boxSize={5}
                            alt="metamask"
                          />
                        }
                        as={Link}
                        href="https://metamask.io/"
                        size="lg"
                        variant="solid-outline"
                        isExternal
                        isFullWidth
                      >
                        Install Metamask
                      </Button>
                    );
                  } else {
                    return null; // dont want to return install twice
                  }
                }

                // don't return metamask if injected provider isn't metamask
                else if (wallet.name === "MetaMask" && !isMetamask) {
                  return null;
                }

                // likewise for generic
                else if (wallet.name === "Injected" && isMetamask) {
                  return null;
                }
              }

              return (
                <Button
                  key={wallet.name}
                  leftIcon={
                    <Image src={wallet.iconUrl} boxSize={5} alt={wallet.name} />
                  }
                  size="lg"
                  variant="solid-outline"
                  onClick={() => onActivate(wallet.connector, wallet.name)}
                  disabled={isPending}
                  isFullWidth
                >
                  {wallet.label || wallet.name}
                </Button>
              );
            })}

            <Text fontSize={["xs", "sm"]} align="center" fontWeight="600">
              We do not own your private keys and cannot access your funds
              without your confirmation.
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
