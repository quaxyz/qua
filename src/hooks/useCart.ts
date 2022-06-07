import _cloneDeep from "lodash.clonedeep";
import { CartContext, CartItem } from "contexts/cart";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

export const useCartStore = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const [loadingCart, setLoadingCart] = useState(false);

  const fetchCartItems = useCallback(async () => {
    setLoadingCart(true);
    try {
      const locallyStoredCart = localStorage.getItem("cart");
      if (locallyStoredCart) {
        setItems(JSON.parse(locallyStoredCart));
      }
    } catch (error) {
      console.warn("Error retrieving cart. No items(s) found");
    } finally {
      setLoadingCart(false);
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
      totalItems: totalItemsInCart,
      totalAmount: totalAmountInCart,
      addCartItem,
      removeCartItem,
      updateCartItem,
      clearCart,
    };
  }, [items, addCartItem, removeCartItem, updateCartItem, clearCart]);
};

export const useCart = () => {
  const cartStore = useContext(CartContext);
  return cartStore;
};
