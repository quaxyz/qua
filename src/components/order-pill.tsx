import React from "react";
import { Text } from "@chakra-ui/react";

const statusColor: any = {
  cancelled: {
    bgColor: "red.200",
    color: "red.800",
  },
  unfulfilled: {
    bgColor: "rgba(254, 238, 205, 1)",
    color: "rgba(120, 81, 2, 1)",
  },
  fulfilled: {
    bgColor: "rgba(205, 254, 240, 1)",
    color: "rgba(2, 120, 87, 1)",
  },
};

const paymentStatusColor: any = {
  paid: {
    bgColor: "rgba(205, 254, 240, 1)",
    color: "rgba(2, 120, 87, 1)",
  },
  contact_seller: {
    bgColor: "rgba(254, 238, 205, 1)",
    color: "rgba(120, 81, 2, 1)",
  },
  unpaid: {
    bgColor: "rgba(254, 238, 205, 1)",
    color: "rgba(120, 81, 2, 1)",
  },
};

export const OrderStatus = ({ status, ...props }: any) => (
  <Text
    textTransform="capitalize"
    {...props}
    {...statusColor[status.toLowerCase()]}
  >
    {status.toLowerCase()}
  </Text>
);

export const OrderPaymentStatus = ({ status, ...props }: any) => (
  <Text
    textTransform="capitalize"
    {...props}
    {...paymentStatusColor[status.toLowerCase()]}
  >
    {status.replace("_", " ").toLowerCase()}
  </Text>
);
