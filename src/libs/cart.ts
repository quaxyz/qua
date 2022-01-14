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
  addCartItem: (item: CartItem, price: number) => void;
  removeCartItem: (itemId: string, price: number) => void;
  updateCartItem: (itemId: string, quantity: number, price: number) => void;
};

export const CartContext = createContext<null | CartContextType>(null);
