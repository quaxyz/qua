import React from "react";
import { IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { FiMinus, FiPlus } from "react-icons/fi";

type QuantityProps = {
  quantity: number;
  setQuantity: (value: number) => void;
  max: number;
  min: number;
};

export function Quantity(props: QuantityProps) {
  return (
    <Stack
      px={2}
      spacing={4}
      direction="row"
      align="center"
      rounded="md"
      bgColor="rgb(0 0 0 / 4%)"
    >
      <IconButton
        aria-label="decrease"
        size="sm"
        variant="outline"
        rounded="full"
        borderWidth="0px"
        icon={<FiMinus />}
        onClick={() =>
          props.quantity - 1 >= props.min &&
          props.setQuantity(props.quantity - 1)
        }
      />

      <Text p={0} textAlign="center" border="none">
        {" "}
        {props.quantity}
      </Text>

      <IconButton
        aria-label="increase"
        size="sm"
        rounded="full"
        variant="ghost"
        icon={<FiPlus />}
        onClick={() =>
          props.quantity + 1 <= props.max &&
          props.setQuantity(props.quantity + 1)
        }
      />
    </Stack>
  );
}
