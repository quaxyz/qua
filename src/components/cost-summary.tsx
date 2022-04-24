import React from "react";
import { formatCurrency } from "libs/currency";
import { Stack, Text } from "@chakra-ui/react";

export const CostSummary = ({
  data,
  currency,
}: {
  data: Object;
  currency?: string;
}) => {
  const total = Object.entries(data).reduce((total, [_, amount]) => {
    return total + amount;
  }, 0);

  return (
    <Stack direction="row" justify="space-between" py={2}>
      <Stack direction="column" spacing={4}>
        {Object.keys(data).map((k) => (
          <Text textTransform="capitalize" key={k}>
            {k}
          </Text>
        ))}

        <Text>Total</Text>
      </Stack>

      <Stack direction="column" spacing={4}>
        {Object.keys(data).map((k) => (
          <Text key={k}>:</Text>
        ))}
        <Text>:</Text>
      </Stack>

      <Stack direction="column" fontWeight="bold" spacing={4}>
        {Object.values(data).map((v, idx) => (
          <Text textTransform="capitalize" key={idx}>
            {formatCurrency(v || 0, currency)}
          </Text>
        ))}

        <Text>{formatCurrency(total || 0, currency)}</Text>
      </Stack>
    </Stack>
  );
};
