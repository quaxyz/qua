import _cloneDeep from "lodash.clonedeep";
import Api from "libs/api";
import { CartContext, CartItem } from "libs/cart";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";

const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const { account } = useWeb3React();

  const fetchCartItems = useCallback(async () => {
    setLoadingCart(true);
    try {
      if (account) {
        const { payload } = await Api().get(`/cart?address=${account}`);
        setItems(payload);
      } else {
        const locallyStoredCart = localStorage.getItem("cartItems");
        locallyStoredCart && setItems(JSON.parse(locallyStoredCart));
      }
    } catch (error) {
      console.warn("Error retrieving cart. No items(s) found");
    } finally {
      setLoadingCart(false);
    }
  }, [account]);

  const syncLocalCartItem = useCallback(async () => {
    try {
      const locallyStoredCart = localStorage.getItem("cartItems");
      if (!locallyStoredCart) return;

      await Api().post(`/cart?address=${account}`, {
        cart: JSON.parse(locallyStoredCart),
      });

      console.log("Cart synced");
      localStorage.removeItem("cartItems");
    } catch (err) {
      console.log("Error syncing cart", err);
    }
  }, [account]);

  const addCartItem = useCallback(
    async (item: CartItem) => {
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

      if (account) {
        await Api().post(`/cart?address=${account}`, {
          cart: editableItems,
        });
      } else {
        localStorage.setItem("cartItems", JSON.stringify(editableItems));
      }
    },
    [account, items]
  );

  const removeCartItem = useCallback(
    async (itemId: string) => {
      const newItems = items.filter((item) => item.productId !== itemId);
      setItems(newItems);

      if (account) {
        await Api().post(`/cart?address=${account}`, {
          cart: newItems,
        });
      } else {
        localStorage.setItem("cartItems", JSON.stringify(newItems));
      }
    },
    [account, items]
  );

  const updateCartItem = useCallback(
    async (itemid: string, quantity: number) => {
      const index = items.findIndex(
        (cartItem) => cartItem.productId === itemid
      );

      let editableItems = _cloneDeep(items);
      editableItems[index].quantity = quantity;

      setItems(editableItems);

      if (account) {
        await Api().post(`/cart?address=${account}`, {
          cart: editableItems,
        });
      } else {
        localStorage.setItem("cartItems", JSON.stringify(editableItems));
      }
    },
    [account, items]
  );

  useEffect(() => {
    if (account) syncLocalCartItem();
    fetchCartItems();
  }, [account, fetchCartItems, syncLocalCartItem]);

  return useMemo(
    () => ({
      items,
      totalInCart: items.reduce((acc, item) => acc + item.quantity, 0),
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
