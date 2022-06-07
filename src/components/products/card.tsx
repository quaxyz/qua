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

export const ProductCard = ({ product, store }: any) => {
  const cart = useCart();

  const productModal = useDisclosure();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariants, setVariant] = React.useState<any>({});
  const [price, setPrice] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (product && product.variants && product.variants.length) {
      const initialVariants = product.variants.reduce(
        (variants: any, variant: any) => {
          variants[variant.type] = variant.options[0];
          return variants;
        },
        {}
      );

      const price =
        Object.values(initialVariants).reduce(
          (total: number, option: any) => total + Number(option.price),
          0
        ) || product.price;

      setVariant(initialVariants);
      setPrice(price);
    }
  }, [product]);

  const handleVariantChange = (type: string, value: any) => {
    const option = product.variants
      .find((v: any) => v.type === type)
      ?.options.find((o: any) => o.option === value);

    if (!option) {
      return;
    }

    const newVariants = {
      ...selectedVariants,
      [type]: option,
    };

    const price =
      Object.values(newVariants).reduce(
        (total: number, option: any) => total + Number(option.price),
        0
      ) || product.price;

    setVariant(newVariants);
    setPrice(price);
  };

  const handleOrderChange = () => {
    cart?.addCartItem({
      productId: product.id,
      quantity: quantity,
      price: price || product.price,
      variants: selectedVariants,
    });

    productModal.onClose();
  };

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
          store={store}
          price={price}
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={productModal.onClose}
          selectedVariants={selectedVariants}
          onSelectVariant={handleVariantChange}
          onAddToOrder={handleOrderChange}
        />
      </Modal>
    </>
  );
};
