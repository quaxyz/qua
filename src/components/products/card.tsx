import React from "react";
import NextImage from "next/image";
import {
  Stack,
  Heading,
  chakra,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  useBreakpointValue,
} from "@chakra-ui/react";
import { formatCurrency } from "libs/currency";
import { ProductModal } from "./modal";

export const ProductCard = ({ product, store }: any) => {
  const productModal = useDisclosure();

  return (
    <>
      <Stack
        py={6}
        rounded="md"
        direction="row"
        cursor="pointer"
        px={{ md: "5%" }}
        justifyContent="space-between"
        w={{ base: "100%", md: "110%" }}
        onClick={productModal.onOpen}
        transition="box-shadow ease-in-out 0.3s"
        _hover={{
          boxShadow: { md: "md" },
        }}
      >
        <Stack spacing={2} flex={2}>
          <Heading
            as="h3"
            fontSize="md"
            fontWeight="600"
            color="rgb(0 0 0 / 80%)"
            textTransform="capitalize"
          >
            {product.name}
          </Heading>

          {!!product.description?.length && (
            <Text fontSize="sm" fontWeight="normal" color="rgb(0 0 0 / 60%)">
              {product.description}
            </Text>
          )}

          <Text fontWeight="normal" color="rgb(0 0 0 / 80%)">
            {formatCurrency(product.price ?? 0, store.currency)}
          </Text>
        </Stack>

        {product.images[0] && (
          <chakra.div flex={1}>
            <NextImage
              width="200em"
              height="140em"
              objectFit="cover"
              style={{ borderRadius: 4 }}
              src={product.images[0]}
              alt={product.name}
            />
          </chakra.div>
        )}
      </Stack>

      <Modal
        size="lg"
        isCentered
        motionPreset="slideInBottom"
        scrollBehavior="inside"
        isOpen={productModal.isOpen}
        onClose={productModal.onClose}
      >
        <ModalOverlay />
        <ProductModal
          onClose={productModal.onClose}
          product={product}
          store={store}
        />
      </Modal>
    </>
  );
};
