import { createContext } from "react";

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  variants?: { [key: string]: any };
};

type CartContextType = {
  synced: boolean;
  items: CartItem[];
  comment?: string;
  totalItems: number;
  totalAmount: number;
  addCartComment: (comment: string) => void;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (itemId: string) => void;
  updateCartItem: (itemId: string, item: CartItem) => void;
  clearCart: () => void;
};

export const CartContext = createContext<null | CartContextType>(null);
