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
} from "@chakra-ui/react";
import { useCart } from "hooks/useCart";
import { formatCurrency } from "libs/currency";
import { ProductModal } from "./modal";

export const ProductCard = ({ product, store, cartItem }: any) => {
  const addOrderModal = useDisclosure();
  const updateOrderModal = useDisclosure();
  let modals: any = {
    add: addOrderModal,
    update: updateOrderModal,
  };

  const [activeModal, setActiveModal] = React.useState<any>("add");
  React.useEffect(() => {
    if (cartItem?.id) setActiveModal("update");
  }, [cartItem?.id]);

  const modal = modals[activeModal];

  const onOrderChange = () => {
    setActiveModal("update");
    modal.onClose();
  };

  const switchToAddNewOrder = () => {
    setActiveModal("add");

    updateOrderModal.onClose();
    addOrderModal.onOpen();
  };

  return (
    <>
      <chakra.div
        py={6}
        rounded="md"
        pos="relative"
        onClick={modal.onOpen}
        w={{ base: "100%", md: "107%" }}
        transition="box-shadow ease-in-out 0.3s"
        _hover={{
          boxShadow: { md: "md" },
        }}
        _before={{
          content: '""',
          position: "absolute",
          width: cartItem ? "4px" : "0px",
          height: "calc(100% - 3rem)",
          bgColor: "gray.800",
          display: "block",
          rounded: 3,
        }}
      >
        <Stack
          w="100%"
          spacing={8}
          direction="row"
          cursor="pointer"
          px={{ base: 4, md: 6 }}
          alignItems="stretch"
          justifyContent="space-between"
        >
          <Stack spacing={2} flex={2}>
            <Heading
              as="h3"
              fontSize="lg"
              fontWeight="600"
              color="rgb(0 0 0 / 80%)"
              textTransform="capitalize"
            >
              {cartItem?.quantity && (
                <chakra.span fontWeight="700" mr={2} color="rgb(0 0 0 / 90%)">
                  {cartItem.quantity}x
                </chakra.span>
              )}

              {product.name}
            </Heading>

            {!!product.description?.length && (
              <Text fontSize="sm" fontWeight="normal" color="rgb(0 0 0 / 60%)">
                {product.description}
              </Text>
            )}

            <Text fontWeight="normal" color="rgb(0 0 0 / 80%)">
              {formatCurrency(
                cartItem?.price * cartItem?.quantity || product.price || 0,
                store.currency
              )}
            </Text>

            {cartItem?.variants && (
              <Stack
                py={1}
                px={2}
                rounded="md"
                direction="row"
                bgColor="gray.100"
                alignItems="center"
              >
                {Object.keys(cartItem.variants).map((variantKey) => {
                  const variant = cartItem.variants[variantKey];

                  return (
                    <Text key={variantKey} fontWeight="500" fontSize="sm">
                      Choose {variantKey}: {variant.option}
                    </Text>
                  );
                })}
              </Stack>
            )}
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
      </chakra.div>

      {/* add order modal */}
      <Modal
        size="lg"
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
        isOpen={addOrderModal.isOpen}
        onClose={addOrderModal.onClose}
      >
        <ModalOverlay />
        <ProductModal
          store={store}
          product={product}
          onOrderChange={onOrderChange}
        />
      </Modal>

      {/* update order modal */}
      <Modal
        size="lg"
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
        isOpen={updateOrderModal.isOpen}
        onClose={updateOrderModal.onClose}
      >
        <ModalOverlay />
        <ProductModal
          store={store}
          order={cartItem}
          product={product}
          onOrderChange={onOrderChange}
          switchToAddNewOrder={switchToAddNewOrder}
        />
      </Modal>
    </>
  );
};
