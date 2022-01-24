/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-dashboard-orders]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "fetch store orders", { query });

        if (!query.store || !query.cursor) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const store = query.store as string;
        const cursor = parseInt(query.cursor as string, 10);
        const orders = await prisma.order.findMany({
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
            Store: {
              name: store,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            customerAddress: true,
            customerDetails: true,
            status: true,
            paymentStatus: true,
          },
        });

        return res.status(200).send(orders);
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
