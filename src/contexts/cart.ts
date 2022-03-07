import { createContext } from "react";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  subTotal: number;
  totalInCart: number;
  loadingCart: boolean;
  addCartItem: (item: CartItem, price: number) => Promise<void>;
  removeCartItem: (itemId: string, price: number) => Promise<void>;
  updateCartItem: (
    itemId: string,
    quantity: number,
    price: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
};

export const CartContext = createContext<null | CartContextType>(null);
