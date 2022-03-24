/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { utils } from "ethers";
import { domain } from "libs/constants";
import { withSession } from "libs/session";

const LOG_TAG = "[store-orders-cancel]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query, body } = req;

      switch (method) {
        case "POST": {
          const { data: session } = req.session;
          console.log(LOG_TAG, "cancel customer orders", {
            query,
            body,
            session,
          });

          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found", {
              query,
              session,
            });

            return res.status(401).send({ error: "No user logged in" });
          }

          if (!query.store) {
            console.log(LOG_TAG, "[warning]", "invalid query", { query });
            return res.status(400).send({ error: "invalid params" });
          }

          const storeName = query.store as string;
          const { orderId } = body;

          const order = await prisma.order.findFirst({
            where: {
              id: parseInt(orderId, 10),
              customer: {
                id: session.userId,
              },
              store: {
                name: storeName,
              },
            },
          });

          if (!order) {
            console.log(LOG_TAG, "[warning]", "order not found", {
              query,
              order,
            });

            return res.status(400).send({ error: "Order not found" });
          }

          if (order?.status !== "UNFULFILLED") {
            console.log(
              LOG_TAG,
              "[warning]",
              "order is already fulfullied or cancelled",
              { query, order }
            );

            return res
              .status(400)
              .send({ error: "order is already fulfullied or cancelled" });
          }

          // set order to cancelled
          const result = await prisma.order.update({
            where: { id: order.id },
            data: { status: "CANCELLED" },
          });

          return res.status(200).send(result);
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
  }
);
