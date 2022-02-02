import React from "react";
import NextLink from "next/link";
import {
  Button,
  ButtonProps,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useLogout } from "hooks/auth";
import { truncateAddress } from "libs/utils";
import { injected, SUPPORTED_WALLETS, switchNetwork } from "libs/wallet";
import { FiExternalLink } from "react-icons/fi";

const ConnectModal = ({ isOpen, isPending, onClose, onActivate }: any) => {
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

const AccountModal = ({ isOpen, onClose, menuOptions = [] }: any) => {
  const { account } = useWeb3React();
  const logOut = useLogout();

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
          Account
        </ModalHeader>

        <ModalBody py={5}>
          <Stack direction="column" spacing={2}>
            <Button
              as={Link}
              href={`https://etherscan.io/address/${account}`}
              rightIcon={<FiExternalLink />}
              size="lg"
              variant="solid-outline"
              isFullWidth
              isExternal
              _hover={{ transform: "none" }}
            >
              {truncateAddress(account || "", 4)}
            </Button>

            {menuOptions.map((menu: any, idx: number) => (
              <NextLink key={idx} href={menu.href} passHref>
                <Button
                  as={Link}
                  onClick={() => {
                    onClose();
                  }}
                  size="lg"
                  variant="solid-outline"
                  isFullWidth
                  _hover={{ transform: "none" }}
                  {...menu.props}
                >
                  {menu.label}
                </Button>
              </NextLink>
            ))}

            <Button
              onClick={() => {
                logOut();
                onClose();
              }}
              color="red.500"
              size="lg"
              variant="solid-outline"
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

type WalletProps = {
  autoOpen?: boolean;
  closeable?: boolean;
  ButtonProps?: ButtonProps;
  menuOptions?: { label: string; href: string; props?: ButtonProps }[];
};
export const Wallet = ({
  ButtonProps,
  menuOptions,
  autoOpen = false,
  closeable = true,
}: WalletProps) => {
  const toast = useToast();
  const { account, activate } = useWeb3React();

  const connectModal = useDisclosure({ defaultIsOpen: autoOpen });
  const accountModal = useDisclosure();

  const [pending, setPending] = React.useState<boolean>();

  const tryActivate = async (connector?: any, name?: string) => {
    if (!connector) return;

    // close modal
    closeable && connectModal.onClose();

    setPending(true);
    try {
      await activate(connector, undefined, true);

      // close modal
      connectModal.onClose();
      console.log("[ConnectModal]", "Account activated", connector);
      if (name) localStorage.setItem("DEFAULT_CONNECTOR", name);
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

        // close modal
        connectModal.onClose();
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
      <Button
        variant="primary"
        onClick={account ? accountModal.onOpen : connectModal.onOpen}
        isLoading={pending}
        {...ButtonProps}
      >
        {account ? truncateAddress(account || "", 4) : "Connect wallet"}
      </Button>

      <ConnectModal
        isOpen={connectModal.isOpen}
        isPending={pending}
        onClose={closeable ? connectModal.onClose : null}
        onActivate={tryActivate}
      />

      <AccountModal
        isOpen={accountModal.isOpen}
        onClose={accountModal.onClose}
        menuOptions={menuOptions}
      />
    </>
  );
};
