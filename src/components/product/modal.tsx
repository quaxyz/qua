import React from "react";
import NextImage from "next/image";
import { v4 as uuidv4 } from "uuid";
import {
  Alert,
  AlertIcon,
  Button,
  chakra,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Radio,
  RadioGroup,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { formatCurrency } from "libs/currency";
import { Quantity } from "components/quantity";
import { useCart } from "hooks/useCart";

export const ProductModal = ({
  store,
  product,
  order,
  onOrderChange,
  switchToAddNewOrder,
}: any) => {
  const cart = useCart();

  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariants, setVariant] = React.useState<any>({});
  const [price, setPrice] = React.useState<number | null>(null);

  // set initial variant values
  React.useEffect(() => {
    if (!order && product && product.variants && product.variants.length) {
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
  }, [product, order]);

  // sync order value if available
  React.useEffect(() => {
    if (!order) return;

    setQuantity(order.quantity);
    setVariant(order.variants);
    setPrice(order.price);
  }, [order]);

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

  const onOrder = () => {
    if (!order) {
      const newOrder = {
        id: uuidv4(),
        quantity,
        productId: product.id,
        price: price || product.price,
        variants: selectedVariants,
      };

      cart?.addCartItem(newOrder);
      return onOrderChange();
    }

    if (!quantity) {
      cart?.removeCartItem(order.id);
      return onOrderChange();
    }

    cart?.updateCartItem(order.id, {
      id: order.id,
      quantity,
      productId: product.id,
      price: price || product.price,
      variants: selectedVariants,
    });
    return onOrderChange();
  };

  return (
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

      <ModalBody p={0}>
        {!!product.images.length ? (
          <chakra.div w="100%" bg="gray.100" overflow="hidden">
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

            {order && (
              <Alert
                status="info"
                variant="subtle"
                rounded="md"
                bgColor="rgb(0 0 0 / 5%)"
              >
                <AlertIcon />

                <Stack alignItems="flex-start">
                  <Text fontSize="sm">
                    {"You're"} currently editing your existing selection.
                  </Text>

                  <Button
                    w="auto"
                    minW="auto"
                    variant="link"
                    size="sm"
                    justifyContent="flex-start"
                    onClick={() => switchToAddNewOrder()}
                  >
                    Add another with different options
                  </Button>
                </Stack>
              </Alert>
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

              <RadioGroup
                onChange={(value) => handleVariantChange(variant.type, value)}
                value={selectedVariants[variant.type]?.option}
              >
                <Stack spacing={2} w="100%">
                  {variant.options.map(
                    ({ option, price }: any, idx: number) => (
                      <Radio
                        size="lg"
                        key={idx}
                        value={option}
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

      <ModalFooter
        justifyContent="initial"
        px={{ base: 3, md: 6 }}
        mb={{ base: 6, md: 0 }}
      >
        <Stack w="full" direction="row" spacing={4}>
          <Quantity
            quantity={quantity}
            setQuantity={(v) => setQuantity(v)}
            max={product.totalStocks || Infinity}
            min={order ? 0 : 1}
          />

          <Button
            py={6}
            flex={1}
            isFullWidth
            variant="primary"
            colorScheme="black"
            justifyContent={quantity ? "space-between" : "center"}
            onClick={() => onOrder()}
          >
            <chakra.span>
              {order
                ? quantity
                  ? "Update order"
                  : "Remove order"
                : "Add to order"}
            </chakra.span>

            {!!quantity && (
              <chakra.span>
                {formatCurrency(
                  (price || product.price) * quantity,
                  store.currency
                )}
              </chakra.span>
            )}
          </Button>
        </Stack>
      </ModalFooter>
    </ModalContent>
  );
};
