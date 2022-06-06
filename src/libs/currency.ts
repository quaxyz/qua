export const allCurrencies = [
  { cc: "USD", symbol: "$", name: "United States dollar" },
  { cc: "EUR", symbol: "\u20ac", name: "European Euro" },
  { cc: "NGN", symbol: "\u20a6", name: "Nigerian naira" },
  { cc: "GBP", symbol: "\u00a3", name: "British pound" },
];

export const formatCurrency = (
  amount: number,
  currency?: string,
  options?: any
) => {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "USD",
    ...options,
  }).format(amount);
};
