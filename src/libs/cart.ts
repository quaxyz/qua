import { createContext } from "react";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  loadingCart: boolean;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
};

export const CartContext = createContext<null | CartContextType>(null);
