/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[store-dashboard-fulfill-order]";

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
            return res.send({ redirect: true, url: "/login" });
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

            return res.send({ redirect: true, url: "/login" });
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
            console.error(LOG_TAG, "order not found", {
              query,
              order,
            });

            return res.status(400).send({ error: "Order not found" });
          }

          if (order?.status !== "UNFULFILLED") {
            console.warn(LOG_TAG, "Order is already fulfullied or cancelled", {
              query,
              order,
            });

            return res.status(400).send({
              error: "order is already fulfullied or cancelled",
            });
          }

          // set order to cancelled
          const [result] = await prisma.$transaction([
            prisma.order.update({
              where: { id: order.id },
              data: { status: "FULFILLED", paymentStatus: "PAID" },
              select: { id: true, status: true, paymentStatus: true },
            }),
            ...(order.items as any[]).map((item) =>
              prisma.product.update({
                where: { id: item.productId },
                data: {
                  totalStocks: {
                    decrement: item.quantity,
                  },
                  totalSold: {
                    increment: item.quantity,
                  },
                },
              })
            ),
          ]);

          return res.status(200).send(result);
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
