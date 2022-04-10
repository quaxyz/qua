/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[admin-orders]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query } = req;

      switch (method) {
        case "GET": {
          console.log(LOG_TAG, "fetch store orders", { query });

          const { data: session } = req.session;
          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found", {
              query,
              session,
            });
            return res.send({ redirect: true, url: "/login" });
          }

          if (!query.store || !query.cursor) {
            console.warn(LOG_TAG, "invalid query", { query });
            return res.status(400).send({ error: "invalid params" });
          }

          const store = query.store as string;
          const cursor = parseInt(query.cursor as string, 10);
          const orders = (
            await prisma.order.findMany({
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
                store: {
                  name: store,
                  owner: {
                    id: session.userId,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                customerDetails: true,
                status: true,
                paymentMethod: true,
                paymentStatus: true,
              },
            })
          ).filter((order) => Object.keys(order.customerDetails || {}).length);

          return res.status(200).send(orders);
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
  }
);
