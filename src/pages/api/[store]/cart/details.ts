/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-cart-details]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "fetch cart items details", { query });

        if (!query.store) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const store = query.store as string;

        const cartItem: any[] = body.cart;
        const products = await prisma.product.findMany({
          where: {
            Store: {
              name: store,
            },
            id: {
              in: cartItem,
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

        console.log(LOG_TAG, "returning cart items", {
          cartProducts: products,
        });
        return res.status(200).send(products);
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
