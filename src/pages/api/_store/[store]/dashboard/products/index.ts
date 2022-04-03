/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-dashboard-products]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "fetch store products", { query });

        if (!query.store || !query.cursor) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const store = query.store as string;
        const cursor = parseInt(query.cursor as string, 10);
        const products = await prisma.product.findMany({
          // pagination
          take: 10,
          ...(!!cursor
            ? {
                skip: 1,
                cursor: {
                  id: parseInt(query.cursor as string, 10),
                },
              }
            : {}),

          // query
          where: {
            name: {
              search: query.search as string,
              mode: "insensitive",
            },
            Store: {
              name: store as string,
            },
          },
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            name: true,
            price: true,
            totalStocks: true,
            totalSold: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        });

        console.log(LOG_TAG, "returning store products", { products });
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
