import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useBreakpointValue,
  Button,
  Link,
  Spacer,
  Icon,
  Text,
  Stack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { FormGroup } from "components/form-group";
import { FcGoogle } from "react-icons/fc";
import { Wallet, User } from "react-iconly";
import NextLink from "next/link";
import React from "react";

export const CustomerModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        variant="props"
        size="md"
        fontSize="15px"
        bg="#131415"
        color="#fff"
        borderRadius="12px"
        // border="1px solid rgba(19, 20, 21, 0.08)"
      >
        <Icon mr="2" as={(props) => <User set="bold" {...props} />} />
        My Account
      </Button>

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
            <Stack direction="column" px="16" pt="12">
              <Text
                as="span"
                color="#131415"
                fontWeight="300"
                fontSize={{ base: "1.4rem", md: "1.8rem" }}
              >
                Setup your account
              </Text>
              <Text
                color="rgba(0, 0, 0, 0.48)"
                fontWeight="400"
                fontSize="1rem"
              >
                Already have an account?
                <Link
                  fontSize={{ base: "1.125rem", md: "1rem" }}
                  color="#131415"
                  ml="2"
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </ModalHeader>

          <ModalBody py={5} px="16">
            <Stack direction="column" spacing={2}>
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
                    // isDisabled={!googleAuth.ready}
                    // isLoading={googleAuth.loading}
                    // onClick={() => googleAuth.signIn()}
                  >
                    Sign up with Google
                  </Button>

                  <Button
                    flex={{ base: "block", md: "1" }}
                    variant="solid-outline"
                    color="#131415"
                    size="lg"
                    leftIcon={<Wallet set="bold" />}
                    // isLoading={walletAuth.isLoading}
                    // onClick={() => walletAuth.onModalOpen()}
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
