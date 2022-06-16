import React from "react";
import NextImage from "next/image";
import {
  Button,
  Center,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Delete } from "react-iconly";
import { Quantity } from "./quantity";
import { useCart } from "hooks/useCart";
import { useQuery } from "react-query";
import { formatCurrency } from "libs/currency";

export const CartModal = ({ children, store }: any) => {
  const cartModal = useDisclosure();
  const cart = useCart();

  const products = useQuery("products", () => []);

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => cartModal.onOpen(),
      })}

      <Modal
        size="lg"
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
        isOpen={cartModal.isOpen}
        onClose={cartModal.onClose}
      >
        <ModalOverlay />
        <ModalContent
          rounded="2xl"
          overflowX="hidden"
          mb={{ base: "0", md: 8 }}
          pos={{ base: "fixed", md: "relative" }}
          bottom={{ base: "0px", md: "initial" }}
          borderBottomRadius={{ base: "0px", md: "2xl" }}
        >
          <ModalCloseButton
            top={4}
            right={4}
            bg="#fff"
            zIndex="10"
            rounded="full"
            _hover={{ bg: "rgb(255 255 255 / 90%)" }}
            size={useBreakpointValue({ base: "md", md: "lg" })}
          />

          {cart?.items.length ? (
            <>
              <ModalBody p={0}>
                <Stack
                  spacing={6}
                  mt={6}
                  divider={<StackDivider borderColor="gray.100" />}
                >
                  <Stack spacing={9} pt={4} px={{ base: 3, md: 6 }}>
                    <Heading as="h2" color="rgb(0 0 0 / 80%)" fontSize="3xl">
                      Your Order
                    </Heading>

                    <Stack spacing={6}>
                      {cart?.items.map((item, idx) => {
                        const product: any = (products.data || []).find(
                          (p: any) => p.id === item.productId
                        );

                        return (
                          <Stack
                            key={item.id}
                            direction="row"
                            spacing={6}
                            alignItems="flex-start"
                          >
                            {product?.images[0] && (
                              <chakra.div>
                                <NextImage
                                  width="60px"
                                  height="60px"
                                  objectFit="cover"
                                  src={product?.images[0]}
                                  alt={product?.name}
                                />
                              </chakra.div>
                            )}

                            <Stack spacing={1} flex={1}>
                              <Heading
                                as="h4"
                                fontSize="md"
                                fontWeight="600"
                                color="rgb(0 0 0 / 80%)"
                              >
                                {product?.name}
                              </Heading>

                              {item.variants && (
                                <Text
                                  fontSize="sm"
                                  textTransform="capitalize"
                                  color="rgb(0 0 0 / 60%)"
                                >
                                  {Object.keys(item.variants || {})
                                    .map((variantKey) => {
                                      const variant = (item.variants as any)[
                                        variantKey
                                      ];

                                      return `${variantKey}: ${variant.option}`;
                                    })
                                    .join("; ")}
                                </Text>
                              )}

                              <Text color="rgb(0 0 0 / 70%)">
                                {formatCurrency(
                                  item?.price * item?.quantity ||
                                    product.price ||
                                    0,
                                  store.currency
                                )}
                              </Text>
                            </Stack>

                            <Stack direction="row" alignItems="stretch">
                              <Quantity
                                quantity={item.quantity}
                                setQuantity={(quantity) => {
                                  cart?.updateCartItem(item.id, {
                                    ...item,
                                    quantity,
                                  });
                                }}
                                max={product?.totalStocks || Infinity}
                                min={1}
                              />

                              <IconButton
                                onClick={() => cart.removeCartItem(item.id)}
                                variant="outlined"
                                bgColor="rgb(0 0 0 / 4%)"
                                aria-label="Delete"
                                icon={<Delete size={20} set="light" />}
                              />
                            </Stack>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>

                  <Stack spacing={4} pb={4} px={{ base: 3, md: 6 }}>
                    <FormControl id="comments">
                      <FormLabel
                        htmlFor="comments"
                        fontSize="md"
                        textTransform="initial"
                      >
                        Add comments for order
                      </FormLabel>

                      <Textarea
                        px={2}
                        rows={4}
                        isRequired
                        rounded="md"
                        variant="outline"
                        placeholder="Special requests, delivery comments, allergies..."
                        value={cart.comment || ""}
                        onChange={(e) => cart.addCartComment(e.target.value)}
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </ModalBody>

              <ModalFooter justifyContent="initial" px={{ base: 3, md: 6 }}>
                <Button
                  h={14}
                  flex={1}
                  isFullWidth
                  variant="primary"
                  colorScheme="black"
                  textAlign="initial"
                  justifyContent="space-between"
                  leftIcon={
                    <Center
                      bgColor="white"
                      color="#000"
                      rounded="full"
                      boxSize="25px"
                      p={2}
                      mr={2}
                    >
                      <Text fontSize="xs" lineHeight="1" color="inherit">
                        {cart.totalItems}
                      </Text>
                    </Center>
                  }
                  rightIcon={
                    <Text ml={2} fontSize="sm" lineHeight="1" color="inherit">
                      {formatCurrency(cart.totalAmount || 0, store.currency)}
                    </Text>
                  }
                >
                  <chakra.span flex={1}>Go to checkout</chakra.span>
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalBody p={0}>
                <Stack spacing={2} mt={14} mb={8} alignItems="center">
                  <Text fontSize="6rem">🥡</Text>
                  <Heading as="h2" color="rgb(0 0 0 / 80%)" fontSize="3xl">
                    No items in your order
                  </Heading>
                  <Text>Add some items to your order</Text>
                </Stack>
              </ModalBody>

              <ModalFooter justifyContent="initial" px={{ base: 3, md: 6 }}>
                <Button
                  h={14}
                  flex={1}
                  isFullWidth
                  variant="primary-outline"
                  colorScheme="black"
                  onClick={() => cartModal.onClose()}
                >
                  <chakra.span flex={1}>Add items</chakra.span>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
