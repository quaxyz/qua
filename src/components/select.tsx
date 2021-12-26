import React, { useState } from "react";
import _snakeCase from "lodash.snakecase";
import {
  Box,
  Button,
  Divider,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useStyleConfig,
} from "@chakra-ui/react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export type SelectMenuProps = {
  value?: string;
  onChange: (value: string | number) => void;
  options: {
    value: string | number;
    label: string;
  }[];
  title?: string;
  placeholder?: string;
  variant?: string;
  size?: string;
};

const SelectMenu = ({
  value,
  onChange,
  placeholder,
  options,
  title,
  variant,
  size,
  ...props
}: SelectMenuProps) => {
  const styles = useStyleConfig("SelectMenu", { variant, size });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onItemSelect = (value: string | number) => {
    onChange(value);
    onClose();
  };

  return (
    <>
      <Box __css={styles} onClick={onOpen} {...props}>
        <Stack w="100%" direction="row" align="center" justify="space-between">
          {value ? (
            <Text>{options.find((o) => o.value === value)?.label}</Text>
          ) : (
            <Text color="rgb(0 0 0 / 12%)">
              {placeholder || "Select option"}
            </Text>
          )}

          <Icon as={FiChevronDown} />
        </Stack>
      </Box>

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
          <ModalHeader
            borderBottom="1px solid rgb(0 0 0 / 24%)"
            align="center"
            color="black"
            py={8}
          >
            {title}
          </ModalHeader>

          <ModalBody py={5}>
            <Stack direction="column" spacing={2}>
              {options.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onItemSelect(option.value)}
                  size="lg"
                  variant="solid-outline"
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

type CreateableSelectMenuProps = {
  onChange: (value: string) => void;
  defaultOptions: {
    value: string;
    label: string;
  }[];

  value?: string;
  title?: string;
  placeholder?: string;
  searchable?: boolean;

  variant?: string;
  size?: string;
  disabled?: boolean;
};

export const CreateableSelectMenu = ({
  variant,
  size,
  ...props
}: CreateableSelectMenuProps) => {
  const styles = useStyleConfig("SelectMenu", { variant, size });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setOptions] = useState(props.defaultOptions);

  const onInputChange = (e: any) => {
    e.preventDefault();

    setOptions([
      {
        value: e.target["search"].value?.toLowerCase(),
        label: e.target["search"].value,
      },
      ...options,
    ]);

    props.onChange(e.target["search"].value?.toLowerCase());
    onClose();
  };

  const onItemSelect = (value: string) => {
    props.onChange(value);
    onClose();
  };

  return (
    <>
      <Box __css={styles} onClick={props.disabled ? undefined : onOpen}>
        <Stack w="100%" direction="row" align="center" justify="space-between">
          {props.value ? (
            <Text>{options.find((o) => o.value === props.value)?.label}</Text>
          ) : (
            <Text color="rgb(0 0 0 / 12%)">
              {props.placeholder || "Select option"}
            </Text>
          )}

          <Icon as={FiChevronDown} />
        </Stack>
      </Box>

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
          <ModalHeader
            borderBottom="1px solid rgb(0 0 0 / 24%)"
            align="center"
            color="black"
            py={8}
          >
            {props.title}
          </ModalHeader>

          <ModalBody px={0}>
            <form onSubmit={onInputChange}>
              <InputGroup mx={2} pb={2}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} />
                </InputLeftElement>

                <Input
                  id="search"
                  border="none"
                  placeholder="Search or create..."
                />
              </InputGroup>
            </form>
            <Divider opacity="1" borderColor="rgb(0 0 0 / 24%)" />

            <Box py={5} px={5}>
              <Stack direction="column" spacing={2}>
                {options.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => onItemSelect(option.value)}
                    size="lg"
                    variant="solid-outline"
                    isFullWidth
                  >
                    {option.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SelectMenu;
