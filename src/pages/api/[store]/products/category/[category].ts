/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-category-products]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "fetch store products in category", { query });

        if (!query.store || !query.category || !query.cursor) {
          console.warn(LOG_TAG, "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const store = query.store as string;
        const products = await prisma.product.findMany({
          // pagination
          take: 12,
          skip: 1,
          cursor: {
            id: parseInt(query.cursor as string, 10),
          },

          // query
          where: {
            category: query.category as string,
            Store: {
              name: store as string,
            },
          },
          orderBy: {
            updatedAt: "desc",
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

        return res.status(200).send(products);
      }
      default:
        console.warn(LOG_TAG, "unauthorized method", method);
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