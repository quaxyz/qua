import _cloneDeep from "lodash.clonedeep";
import Api from "libs/api";
import { CartContext, CartItem } from "contexts/cart";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

const useCart = (cart?: any, options?: any) => {
  const [items, setItems] = useState<CartItem[]>(cart?.items || []);
  const [subTotal, setSubtotal] = useState(cart?.total || 0);

  const [loadingCart, setLoadingCart] = useState(false);
  const [syncingCart, setSyncingCart] = useState(false);

  const fetchCartItems = useCallback(async () => {
    setLoadingCart(true);
    try {
      const locallyStoredCart = localStorage.getItem("cartItems");
      if (locallyStoredCart) {
        // TODO:: merge with current cart
        setItems(JSON.parse(locallyStoredCart).items);
        setSubtotal(JSON.parse(locallyStoredCart).subtotal);
      }
    } catch (error) {
      console.warn("Error retrieving cart. No items(s) found");
    } finally {
      setLoadingCart(false);
    }
  }, []);

  const syncLocalCartItem = useCallback(async () => {
    setSyncingCart(true);
    try {
      const locallyStoredCart = localStorage.getItem("cartItems");
      if (!locallyStoredCart) return;

      await Api().post(`/cart`, {
        cart: JSON.parse(locallyStoredCart).items,
      });

      console.log("Cart synced");
      localStorage.removeItem("cartItems");
    } catch (err) {
      console.log("Error syncing cart", err);
    } finally {
      setSyncingCart(false);
    }
  }, []);

  const addCartItem = useCallback(
    async (item: CartItem, price: number) => {
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

      const subtotal = subTotal + item.quantity * price;

      setItems(editableItems);
      setSubtotal(subtotal);

      if (options?.isLoggedIn) {
        await Api().post(`/cart`, {
          cart: editableItems,
        });
      } else {
        localStorage.setItem(
          "cartItems",
          JSON.stringify({
            items: editableItems,
            subtotal,
          })
        );
      }
    },
    [items, subTotal, options?.isLoggedIn]
  );

  const removeCartItem = useCallback(
    async (itemId: string, price: number) => {
      const index = items.findIndex(
        (cartItem) => cartItem.productId === itemId
      );

      const newItems = items.filter((item) => item.productId !== itemId);
      const newSubtotal = subTotal - items[index].quantity * price;

      setItems(newItems);
      setSubtotal(newSubtotal);

      if (options?.isLoggedIn) {
        await Api().post(`/cart`, {
          cart: newItems,
        });
      } else {
        localStorage.setItem(
          "cartItems",
          JSON.stringify({
            items: newItems,
            subtotal: newSubtotal,
          })
        );
      }
    },
    [options?.isLoggedIn, items, subTotal]
  );

  const updateCartItem = useCallback(
    async (itemid: string, quantity: number, price: number) => {
      const index = items.findIndex(
        (cartItem) => cartItem.productId === itemid
      );

      let editableItems = _cloneDeep(items);
      editableItems[index].quantity = quantity;

      const subtotal =
        subTotal -
        items[index].quantity * price +
        editableItems[index].quantity * price;

      setItems(editableItems);
      setSubtotal(subtotal);

      if (options?.isLoggedIn) {
        await Api().post(`/cart`, {
          cart: editableItems,
        });
      } else {
        localStorage.setItem(
          "cartItems",
          JSON.stringify({
            items: editableItems,
            subtotal,
          })
        );
      }
    },
    [options?.isLoggedIn, items, subTotal]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    setSubtotal(0);

    if (options?.isLoggedIn) {
      await Api().post(`/cart`, {
        cart: [],
      });
    } else {
      localStorage.setItem(
        "cartItems",
        JSON.stringify({
          items: [],
          subtotal: 0,
        })
      );
    }
  }, [options?.isLoggedIn]);

  useEffect(() => {
    if (options?.isLoggedIn) syncLocalCartItem();
    fetchCartItems();
  }, [options?.isLoggedIn, fetchCartItems, syncLocalCartItem]);

  // listen for cart changes
  useEffect(() => {
    if (options?.isLoggedIn) {
      setItems(cart.items);
      setSubtotal(cart.total);
    }
  }, [cart, options?.isLoggedIn]);

  return useMemo(
    () => ({
      items,
      subTotal,
      totalInCart: items.reduce((acc, item) => acc + item.quantity, 0),
      loadingCart,
      syncingCart,
      addCartItem,
      removeCartItem,
      updateCartItem,
      clearCart,
    }),
    [
      items,
      subTotal,
      loadingCart,
      syncingCart,
      addCartItem,
      removeCartItem,
      updateCartItem,
      clearCart,
    ]
  );
};

export const useCartStore = () => {
  const cartStore = useContext(CartContext);
  return cartStore;
};

export default useCart;
