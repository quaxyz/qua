import { createContext } from "react";

export type CartItem = {
  productId: string;
  quantity: number;
  variants?: { [key: string]: string };
};

type CartContextType = {
  items: CartItem[];
  totalInCart: number;
  loadingCart: boolean;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<null | CartContextType>(null);
