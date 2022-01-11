import React from "react";
import { IconButton, Input, Stack } from "@chakra-ui/react";
import { FiMinus, FiPlus } from "react-icons/fi";

type QuantityProps = {
  quantity: number;
  setQuantity: (value: number) => void;
  max: number;
  min: number;
};

export function Quantity(props: QuantityProps) {
  return (
    <Stack direction="row" align="center" border="1px solid rgb(0 0 0 / 12%)">
      <IconButton
        aria-label="decrease"
        size="sm"
        variant="outline"
        rounded="0px"
        borderWidth="0px"
        borderRightWidth="1px"
        borderColor="rgb(0 0 0 / 12%)"
        icon={<FiMinus />}
        _hover={{ transform: "none" }}
        onClick={() =>
          props.quantity - 1 >= props.min &&
          props.setQuantity(props.quantity - 1)
        }
      />

      <Input
        w="60px" // using this until someone adds 10000000 quantity of a product
        p={0}
        textAlign="center"
        border="none"
        type="number"
        value={props.quantity}
        onChange={(e) => props.setQuantity(parseInt(e.target.value, 10))}
      />

      <IconButton
        aria-label="increase"
        size="sm"
        variant="outline"
        rounded="0px"
        borderWidth="0px"
        borderLeftWidth="1px"
        borderColor="rgb(0 0 0 / 12%)"
        icon={<FiPlus />}
        _hover={{ transform: "none" }}
        onClick={() =>
          props.quantity + 1 <= props.max &&
          props.setQuantity(props.quantity + 1)
        }
      />
    </Stack>
  );
}
