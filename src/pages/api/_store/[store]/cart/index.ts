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

        const cart = await prisma.cart.findFirst({
          where: {
            owner: {
              address,
            },
            store: {
              name: store,
            },
          },
        });

        if (!cart || !(cart?.items as any)?.length) {
          return res.status(200).send({
            items: [],
            total: 0,
          });
        }

        const cartItems = cart.items as any[];
        const cartIds = cartItems.map((c) => c.productId);
        const products = await prisma.product.findMany({
          where: {
            Store: {
              name: store,
            },
            id: {
              in: cartIds,
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            totalStocks: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        });

        const total = products.reduce((acc, product) => {
          const cart = cartItems.find((item) => item.productId === product.id);
          return acc + cart.quantity * product.price;
        }, 0);

        return res.status(200).send({
          items: cartItems,
          total,
        });
      }
      case "POST": {
        console.log(LOG_TAG, "update cart items", { query, body });

        if (!query.store || !query.address) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const storeName = query.store as string;
        const address = query.address as string;

        // remapping not to accept bad fields from client - good idea? idk
        const cartItems = (body.cart || []).map((cart: any) => ({
          productId: cart.productId,
          quantity: cart.quantity,
        }));

        const result = await prisma.cart.upsert({
          where: {
            ownerAddress_storeName: {
              ownerAddress: address,
              storeName,
            },
          },
          create: {
            items: cartItems,
            owner: {
              connectOrCreate: {
                where: { address },
                create: { address },
              },
            },
            store: {
              connect: {
                name: storeName,
              },
            },
          },
          update: {
            items: cartItems,
          },
        });

        return res.status(200).send(result.items || []);
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
