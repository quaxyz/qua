import React from "react";
import {
  Button,
  Link,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { truncateAddress } from "libs/utils";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected, SUPPORTED_WALLETS, switchNetwork } from "libs/wallet";
import { FiExternalLink } from "react-icons/fi";

const ConnectModal = ({ isOpen, isPending, onClose, onActivate }: any) => {
  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent rounded="0px" px={10}>
        <ModalCloseButton rounded="full" bg="rgba(0, 0, 0, 0.02)" size="lg" fontSize="sm" top={5} right={10} />
        <ModalHeader color="black" py={8}>
          Connect your wallet
        </ModalHeader>

        <ModalBody py={5} mb={8}>
          <Text>
            Sign in with one of your crypto wallet providers or create a new wallet.{" "}
            <Link isExternal href="https://www.google.com/">
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
                        leftIcon={<Image src="/wallets/metamask.png" boxSize={5} alt="metamask" />}
                        as={Link}
                        href="https://metamask.io/"
                        size="lg"
                        variant="outline"
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
                  leftIcon={<Image src={wallet.iconUrl} boxSize={5} alt={wallet.name} />}
                  size="lg"
                  variant="outline"
                  onClick={() => onActivate(wallet.connector)}
                  disabled={isPending}
                  isFullWidth
                >
                  {wallet.label || wallet.name}
                </Button>
              );
            })}

            <Text fontSize="sm" align="center" fontWeight="600">
              We do not own your private keys and cannot access your funds without your confirmation.
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const AccountModal = ({ isOpen, onClose }: any) => {
  const { account, deactivate } = useWeb3React();
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton rounded="full" bg="rgba(0, 0, 0, 0.02)" size="lg" fontSize="sm" top={6} right={5} />
        <ModalHeader align="center" color="black" py={8}>
          Account
        </ModalHeader>

        <ModalBody py={5}>
          <Stack direction="column" spacing={2}>
            <Button
              as={Link}
              href={`https://etherscan.io/address/${account}`}
              rightIcon={<FiExternalLink />}
              size="lg"
              variant="outline"
              isFullWidth
              isExternal
            >
              {truncateAddress(account || "", 4)}
            </Button>

            <Button
              onClick={() => {
                deactivate();
                onClose();
              }}
              color="red.500"
              size="lg"
              variant="outline"
              isFullWidth
            >
              Log out
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const Wallet = () => {
  const toast = useToast();
  const { account, activate } = useWeb3React();

  const connectModal = useDisclosure();
  const accountModal = useDisclosure();

  const [pending, setPending] = React.useState<boolean>();

  const tryActivate = async (connector?: any) => {
    if (!connector) return;

    // close modal
    connectModal.onClose();

    setPending(true);
    try {
      await activate(connector, undefined, true);

      console.log("[ConnectModal]", "Account activated", connector);
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
      } else {
        console.warn("[ConnectModal] Error activating account", error);
        toast({
          title: "Error connecting account",
          description: (error as any)?.message,
          position: "bottom-right",
          status: "error",
        });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={account ? accountModal.onOpen : connectModal.onOpen} isLoading={pending}>
        {account ? truncateAddress(account || "", 4) : "Connect wallet"}
      </Button>

      <ConnectModal
        isOpen={connectModal.isOpen}
        isPending={pending}
        onClose={connectModal.onClose}
        onActivate={tryActivate}
      />

      <AccountModal isOpen={accountModal.isOpen} onClose={accountModal.onClose} />
    </>
  );
};
