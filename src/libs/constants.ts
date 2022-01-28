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

export const defaultCategories = [
  { value: "arts_crafts", label: "Arts & Crafts" },
  { value: "books", label: "Books" },
  { value: "beauty_cosmetics", label: "Beauty & Cosmetics" },
  { value: "computer_electronics", label: "Computer & Electronics" },
  { value: "fashion_clothing", label: "Fashion & Clothing" },
  { value: "food", label: "Food" },
  { value: "furniture", label: "Furniture" },
  { value: "groceries", label: "Groceries" },
  { value: "health_fitness", label: "Health & Fitness" },
  { value: "home_kitchen", label: "Home & Kitchen" },
  { value: "industrial_scientific", label: "Industrial & Scientific" },
  { value: "pet_supplies", label: "Pet supplies" },
  { value: "toys_games", label: "Toys & Games" },
];
