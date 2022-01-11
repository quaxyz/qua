/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-cart]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "fetch cart items", { query });

        if (!query.store || !query.address) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const store = query.store as string;
        const address = query.address as string;

        const user = await prisma.user.findFirst({
          where: {
            address,
          },
          select: {
            cart: true,
          },
        });

        if (!user) {
          return res.status(200).send([]);
        }

        // manually filter json cart
        const cart = ((user.cart as any[]) || []).filter(
          (cart: any) => cart.store === store
        );

        // so if query.withProduct is true, then we fetch the cart product information also
        if (!query.withProduct) return res.status(200).send(cart);

        const products = await prisma.product.findMany({
          where: {
            id: {
              in: cart.map((c) => c.productId),
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        });

        const cartWithDetails = cart.reduce((total, cart) => {
          const product = products.find((p) => cart.productId === p.id)!;

          total.push({
            productId: cart.productId,
            quantity: cart.quantity,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
          });

          return total;
        }, []);

        console.log(LOG_TAG, "returning cart items", { cartWithDetails });
        return res.status(200).send(cartWithDetails);
      }
      case "POST": {
        console.log(LOG_TAG, "update cart items", { query, body });

        if (!query.store || !query.address) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const storeName = query.store as string;
        const address = query.address as string;

        const cartItems = (body.cart || []).map((cart: any) => ({
          productId: cart.productId,
          quantity: cart.quantity,
          store: storeName,
        }));

        const user = await prisma.user.upsert({
          where: { address },
          create: { address, cart: cartItems },
          update: { address, cart: cartItems },
          select: { cart: true },
        });

        return res.status(200).send(user.cart || []);
      }
      default:
        console.log(LOG_TAG, "[error]", "unauthorized method", method);
        return res.status(500).send({ error: "unauthorized method" });
    }
  } catch (error) {
    console.log(LOG_TAG, "[error]", "general error", {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    return res.status(500).send({ error: "request failed" });
  }
};
