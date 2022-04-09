import _cloneDeep from "lodash.clonedeep";
import Api from "libs/api";
import { CartContext, CartItem } from "contexts/cart";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const [loadingCart, setLoadingCart] = useState(false);

  const fetchCartItems = useCallback(async () => {
    setLoadingCart(true);
    try {
      const locallyStoredCart = localStorage.getItem("cartItems");
      if (locallyStoredCart) {
        setItems(JSON.parse(locallyStoredCart).items);
      }
    } catch (error) {
      console.warn("Error retrieving cart. No items(s) found");
    } finally {
      setLoadingCart(false);
    }
  }, []);

  const addCartItem = useCallback(
    (item: CartItem) => {
      let editableItems = _cloneDeep(items);

      // first check if item is already added
      const index = editableItems.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (index >= 0) {
        editableItems[index].quantity =
          editableItems[index].quantity + item.quantity;
      } else {
        editableItems = [...items, item];
      }

      setItems(editableItems);

      localStorage.setItem(
        "cartItems",
        JSON.stringify({
          items: editableItems,
        })
      );
    },
    [items]
  );

  const removeCartItem = useCallback(
    (itemId: string) => {
      const newItems = items.filter((item) => item.productId !== itemId);

      setItems(newItems);

      localStorage.setItem(
        "cartItems",
        JSON.stringify({
          items: newItems,
        })
      );
    },
    [items]
  );

  const updateCartItem = useCallback(
    (itemid: string, quantity: number) => {
      const index = items.findIndex(
        (cartItem) => cartItem.productId === itemid
      );

      let editableItems = _cloneDeep(items);
      editableItems[index].quantity = quantity;

      setItems(editableItems);

      localStorage.setItem(
        "cartItems",
        JSON.stringify({
          items: editableItems,
        })
      );
    },
    [items]
  );

  const clearCart = useCallback(() => {
    setItems([]);

    localStorage.setItem(
      "cartItems",
      JSON.stringify({
        items: [],
      })
    );
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return useMemo(
    () => ({
      items,
      totalInCart: items.reduce((acc, item) => acc + item.quantity, 0),
      loadingCart,
      addCartItem,
      removeCartItem,
      updateCartItem,
      clearCart,
    }),
    [items, loadingCart, addCartItem, removeCartItem, updateCartItem, clearCart]
  );
};

export const useCartStore = () => {
  const cartStore = useContext(CartContext);
  return cartStore;
};

export default useCart;
