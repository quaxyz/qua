import React from "react";
import NextImage from "next/image";
import {
  Button,
  chakra,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { formatCurrency } from "libs/currency";
import { Quantity } from "components/quantity";

export const ProductModal = ({ product, store }: any) => {
  return (
    <ModalContent
      rounded="2xl"
      overflowX="hidden"
      mb={{ base: "0", md: 14 }}
      borderBottomRadius={{ base: "0px", md: "2xl" }}
      pos={{ base: "fixed", md: "relative" }}
      bottom={{ base: "0px", md: "initial" }}
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
      <ModalBody p={0}>
        {!!product.images.length ? (
          <chakra.div w="100%" bg="#000" overflow="hidden">
            <NextImage
              width="100%"
              height="60%"
              objectFit="cover"
              layout="responsive"
              src={product.images[0]}
              alt={product.name}
            />
          </chakra.div>
        ) : (
          <chakra.div mb={10} />
        )}

        <Stack spacing={6} divider={<StackDivider borderColor="gray.100" />}>
          <Stack spacing={4} pt={4} px={{ base: 3, md: 6 }}>
            <Heading as="h2" color="rgb(0 0 0 / 80%)" fontSize="3xl">
              {product.name}
            </Heading>

            <Text fontWeight="500" color="rgb(0 0 0 / 80%)">
              {formatCurrency(product.price ?? 0, store.currency)}
            </Text>

            {product.description && (
              <Text fontWeight="normal" color="rgb(0 0 0 / 60%)">
                {product.description}
              </Text>
            )}
          </Stack>

          {(product.variants || []).map((variant: any, idx: number) => (
            <Stack key={idx} spacing={4} pb={4} px={{ base: 3, md: 6 }}>
              <Heading
                as="h3"
                color="rgb(0 0 0 / 80%)"
                fontSize="md"
                textTransform="capitalize"
              >
                Choose {variant.type}:
              </Heading>

              <RadioGroup defaultValue="1">
                <Stack spacing={2} w="100%">
                  {variant.options.map(
                    ({ option, price }: any, idx: number) => (
                      <Radio
                        size="lg"
                        key={idx}
                        value="2"
                        sx={{ "& + .chakra-radio__label": { flex: 1 } }}
                      >
                        <Stack direction="row" w="100%" alignItems="center">
                          <chakra.span>{option}</chakra.span>

                          {price.length && (
                            <chakra.span
                              ml="auto !important"
                              fontSize="sm"
                              color="rgb(0 0 0 / 60%)"
                            >
                              {formatCurrency(
                                Number(price) - Number(product.price),
                                store.currency,
                                { signDisplay: "always" }
                              )}
                            </chakra.span>
                          )}
                        </Stack>
                      </Radio>
                    )
                  )}
                </Stack>
              </RadioGroup>
            </Stack>
          ))}
        </Stack>
      </ModalBody>

      <ModalFooter justifyContent="initial" px={{ base: 3, md: 6 }}>
        <Stack w="full" direction="row" spacing={4}>
          <Quantity
            quantity={1}
            setQuantity={(v) => null}
            max={product.totalStocks || Infinity}
            min={1}
          />

          <Button
            py={6}
            flex={1}
            isFullWidth
            variant="primary"
            colorScheme="black"
            justifyContent="space-between"
          >
            <chakra.span>Add to order</chakra.span>
            <chakra.span>$5.50</chakra.span>
          </Button>
        </Stack>
      </ModalFooter>
    </ModalContent>
  );
};
