export const domain = {
  name: "Qua",
  version: "1.0.0",
};

export const schemas = {
  Store: [
    { name: "from", type: "address" },
    { name: "store", type: "string" },
    { name: "timestamp", type: "uint64" },
    { name: "details", type: "string" },
  ],
  GenerateSigningKey: [
    { name: "from", type: "address" },
    { name: "store", type: "string" },
    { name: "timestamp", type: "uint64" },
    { name: "publicKey", type: "string" },
  ],
  Order: [
    { name: "from", type: "address" },
    { name: "store", type: "string" },
    { name: "timestamp", type: "uint64" },
    { name: "cart", type: "string" },
    { name: "shipping", type: "string" },
    { name: "paymentMethod", type: "string" },
  ],
  OrderCancel: [
    { name: "from", type: "address" },
    { name: "store", type: "string" },
    { name: "timestamp", type: "uint64" },
    { name: "orderId", type: "uint64" },
  ],
  AccountDetails: [
    { name: "from", type: "address" },
    { name: "store", type: "string" },
    { name: "timestamp", type: "uint64" },
    { name: "details", type: "string" },
  ],
};
