import { Stack, Text } from "@chakra-ui/react";
import React from "react";

export const CostSummary = () => {
  return (
    <Stack direction="row" justify="space-between" py={2}>
      <Stack direction="column" spacing={4}>
        <Text>Subtotal</Text>
        <Text>Network Fee</Text>
        <Text>Total</Text>
      </Stack>
      <Stack direction="column" spacing={4}>
        <Text>:</Text>
        <Text>:</Text>
        <Text>:</Text>
      </Stack>
      <Stack direction="column" fontWeight="bold" spacing={4}>
        <Text>$200</Text>
        <Text>$1</Text>
        <Text>$200</Text>
      </Stack>
    </Stack>
  );
};
