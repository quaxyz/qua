import _cloneDeep from "lodash.clonedeep";
import { CartContext, CartItem } from "contexts/cart";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

export const useCartStore = () => {
  const [hasSyncedCart, setHasSyncedCart] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [comment, setComment] = useState<string>();

  const fetchCartItems = useCallback(async () => {
    try {
      const locallyStoredCart = localStorage.getItem("cart");
      if (locallyStoredCart) {
        setItems(JSON.parse(locallyStoredCart));
      }
    } catch (error) {
      console.warn("Error retrieving cart. No items(s) found");
    } finally {
      setHasSyncedCart(true);
    }
  }, []);

  const addCartItem = useCallback(
    (item: CartItem) => {
      const newCartItems = [...items, item];

      setItems(newCartItems);
      localStorage.setItem("cart", JSON.stringify(newCartItems));
    },
    [items]
  );

  const updateCartItem = useCallback(
    (id: string, item: CartItem) => {
      const index = items.findIndex((cartItem) => cartItem.id === id);

      let editableItems = _cloneDeep(items);
      editableItems[index] = item;

      setItems(editableItems);
      localStorage.setItem("cart", JSON.stringify(editableItems));
    },
    [items]
  );

  const removeCartItem = useCallback(
    (itemId: string) => {
      const newItems = items.filter((item) => item.id !== itemId);

      setItems(newItems);
      localStorage.setItem("cart", JSON.stringify(newItems));
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

  const addCartComment = useCallback(
    (comment: string) => {
      setComment(comment);
    },
    [setComment]
  );

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return useMemo(() => {
    const totalItemsInCart = items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    const totalAmountInCart = items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );

    return {
      items,
      comment,
      synced: hasSyncedCart,
      totalItems: totalItemsInCart,
      totalAmount: totalAmountInCart,
      addCartItem,
      removeCartItem,
      updateCartItem,
      clearCart,
      addCartComment,
    };
  }, [
    items,
    comment,
    hasSyncedCart,
    addCartItem,
    removeCartItem,
    updateCartItem,
    clearCart,
    addCartComment,
  ]);
};

export const useCart = () => {
  const cartStore = useContext(CartContext);
  return cartStore;
};
