/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-products-details]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "fetch product item", { query });

        if (
          !query.store ||
          !query.id ||
          isNaN(parseInt(query.id as string, 10))
        ) {
          console.warn(LOG_TAG, "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const store = query.store as string;

        const product = await prisma.product.findFirst({
          where: {
            id: parseInt(query.id as string, 10),
            Store: {
              name: store,
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            totalStocks: true,
            totalSold: true,
            images: {
              select: {
                url: true,
              },
            },
          },
        });

        console.log(LOG_TAG, "returning product details", {
          product,
        });

        if (!product) {
          return res.status(200).send(null);
        }

        return res.status(200).send({
          ...product,
          availableStocks: product.totalStocks,
        });
      }
      default:
        console.error(LOG_TAG, "unauthorized method", method);
        return res.status(500).send({ error: "unauthorized method" });
    }
  } catch (error) {
    console.error(LOG_TAG, "general error", {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    return res.status(500).send({ error: "request failed" });
  }
};
