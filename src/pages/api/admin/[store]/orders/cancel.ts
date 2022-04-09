/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[admin-cancel-order]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query, body } = req;

      switch (method) {
        case "POST": {
          const { data: session } = req.session;
          console.log(LOG_TAG, "cancel store order", { query, body });

          // verify session
          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found", {
              query,
              session,
            });
            return res.send({ redirect: true, url: "/dashboard/login" });
          }

          // verify store owner
          const store = await prisma.store.findFirst({
            where: {
              name: query.store as string,
              owner: {
                id: session.userId,
              },
            },
          });
          if (!store) {
            console.warn(LOG_TAG, "User not owner of the store", {
              query,
              session,
            });

            return res.send({ redirect: true, url: "/dashboard/login" });
          }

          const storeName = query.store as string;
          const { orderId } = body;

          const order = await prisma.order.findFirst({
            where: {
              id: parseInt(orderId, 10),
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
              "Order is already fulfullied, cancelled",
              { query, order }
            );

            return res.status(400).send({
              error: "order is already fulfullied, cancelled",
            });
          }

          // set order to cancelled
          const result = await prisma.order.update({
            where: { id: order.id },
            data: { status: "CANCELLED" },
            select: { id: true, status: true },
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
