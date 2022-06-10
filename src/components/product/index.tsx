import React from "react";
import { useCart } from "hooks/useCart";
import { ProductCard } from "./card";

export const Product = ({ product, store }: any) => {
  const cart = useCart();

  const productCartItems = React.useMemo(() => {
    return cart?.items.filter((i) => i.productId === product.id);
  }, [cart?.items, product.id]);

  return (
    <React.Fragment>
      {(productCartItems?.length ? productCartItems : [null]).map(
        (cartItem, idx) => {
          return (
            <ProductCard
              store={store}
              product={product}
              cartItem={cartItem}
              key={`${product.id}-${idx}`}
            />
          );
        }
      )}
    </React.Fragment>
  );
};
