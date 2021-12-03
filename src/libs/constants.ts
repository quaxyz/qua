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
};
