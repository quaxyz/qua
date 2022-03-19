import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "./link";

export const AccountMenu = ({ children, options }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

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
    </>
  );
};
