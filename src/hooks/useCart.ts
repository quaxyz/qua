import _cloneDeep from "lodash.clonedeep";
import Api from "libs/api";
import { CartContext, CartItem } from "contexts/cart";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";

const useCart = (props: any) => {
  const [items, setItems] = useState<CartItem[]>(props?.items || []);
  const [subTotal, setSubtotal] = useState(props?.total || 0);

  const [loadingCart, setLoadingCart] = useState(false);
  const [syncingCart, setSyncingCart] = useState(false);
  const { account } = useWeb3React();

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

      await Api().post(`/cart?address=${account}`, {
        cart: JSON.parse(locallyStoredCart),
      });

      console.log("Cart synced");
      localStorage.removeItem("cartItems");
    } catch (err) {
      console.log("Error syncing cart", err);
    } finally {
      setSyncingCart(false);
    }
  }, [account]);

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

      if (account) {
        await Api().post(`/cart?address=${account}`, {
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
    [account, items, subTotal]
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

      if (account) {
        await Api().post(`/cart?address=${account}`, {
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
    [account, items, subTotal]
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

      if (account) {
        await Api().post(`/cart?address=${account}`, {
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
    [account, items, subTotal]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    setSubtotal(0);

    if (account) {
      await Api().post(`/cart?address=${account}`, {
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
  }, [account]);

  useEffect(() => {
    if (account) syncLocalCartItem();
    fetchCartItems();
  }, [account, fetchCartItems, syncLocalCartItem]);

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
