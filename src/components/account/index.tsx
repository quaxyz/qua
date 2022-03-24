import React from "react";
import Link from "components/link";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Stack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { LoginModal } from "./login";

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
              <Button
                key={idx}
                href={option.href}
                as={Link}
                size="lg"
                variant="solid-outline"
                isFullWidth
                onClick={() => {
                  if (option.onClick) option.onClick();
                  onClose();
                }}
              >
                {option.label}
              </Button>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
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
