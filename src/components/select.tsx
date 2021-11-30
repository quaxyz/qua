import React from "react";
import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";

export type SelectMenuProps = {
  value?: string;
  onSelect: (value: string | number) => void;
  options: {
    value: string | number;
    label: string;
  }[];
  title?: string;
  placeholder?: string;
};

const SelectMenu = ({ value, onSelect, placeholder, options, title, ...props }: SelectMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onItemSelect = (value: string | number) => {
    onSelect(value);
    onClose();
  };

  return (
    <>
      <Box {...props} onClick={onOpen} cursor="pointer" pt={3} pb={2}>
        <Stack w="100%" direction="row" align="center" justify="space-between">
          {value ? (
            <Text>{options.find((o) => o.value === value)?.label}</Text>
          ) : (
            <Text color="rgb(0 0 0 / 12%)">{placeholder || "Select option"}</Text>
          )}

          <Icon as={FiChevronDown} />
        </Stack>
      </Box>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton rounded="full" bg="rgba(0, 0, 0, 0.02)" size="lg" fontSize="sm" top={6} right={5} />
          <ModalHeader borderBottom="1px solid rgb(0 0 0 / 24%)" align="center" color="black" py={8}>
            {title}
          </ModalHeader>

          <ModalBody py={5}>
            <Stack direction="column" spacing={2}>
              {options.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onItemSelect(option.value)}
                  size="lg"
                  variant="outline"
                  isFullWidth
                >
                  {option.label}
                </Button>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SelectMenu;
