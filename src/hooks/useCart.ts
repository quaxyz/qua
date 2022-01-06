import { CartContext, CartItem } from "libs/cart";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useToast } from "@chakra-ui/react";

let initCart: CartItem[] = [
  {
    productId: "1",
    quantity: 3,
  },
  {
    productId: "2",
    quantity: 4,
  },
  {
    productId: "3",
    quantity: 4,
  },
];

const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(initCart);
  const [loadingCart, setLoadingCart] = useState(false);
  const { account } = useWeb3React();
  const toast = useToast();

  const fetchCartItems = useCallback(async () => {
    setLoadingCart(true);
    try {
      const locallyStoredCart = localStorage.getItem("cartItems");
      locallyStoredCart && setItems(JSON.parse(locallyStoredCart));
    } catch (error) {
      toast({
        title: "Error retrieving cart",
        description: "No item(s) found",
        position: "bottom-right",
        status: "error",
      });
    } finally {
      setLoadingCart(false);
    }
  }, []);

  const addCartItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => [...prev, item]);
      localStorage.setItem("cartItems", JSON.stringify(items));
    },
    [items]
  );

  const removeCartItem = useCallback(
    (itemId: string) => {
      setItems((oldItems) =>
        oldItems.filter((item) => item.productId !== itemId)
      );
      localStorage.setItem("cartItems", JSON.stringify(items));
    },
    [items]
  );

  const updateCartItem = useCallback(
    (itemid: string, quantity: number) => {
      const index = items.findIndex(
        (cartItem) => cartItem.productId === itemid
      );
      const editableItem = items;
      editableItem[index].quantity = quantity;
      setItems(editableItem);
    },
    [items]
  );

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return useMemo(
    () => ({
      items,
      loadingCart,
      addCartItem,
      removeCartItem,
      updateCartItem,
    }),
    [addCartItem, items, loadingCart, removeCartItem, updateCartItem]
  );
};

export const useCartStore = () => {
  const cartStore = useContext(CartContext);
  return cartStore;
};

export default useCart;
