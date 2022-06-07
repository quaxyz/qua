import { createContext } from "react";

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  variants?: { [key: string]: any };
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<null | CartContextType>(null);
