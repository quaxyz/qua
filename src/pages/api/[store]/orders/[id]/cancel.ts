/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[store-order-cancel]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "cancel customer orders", {
          query,
          body,
        });

        if (!query.store || !query.id) {
          console.warn(LOG_TAG, "invalid query", { query });
          return res.status(400).send({ error: "invalid query" });
        }

        if (!body.email) {
          console.warn(LOG_TAG, "invalid payload", { query });
          return res.status(400).send({ error: "invalid payload" });
        }

        const storeName = query.store as string;

        const order = await prisma.order.findFirst({
          where: {
            publicId: query.id as string,
            store: {
              name: storeName,
            },
          },
          select: {
            id: true,
            status: true,
            customerDetails: true,
          },
        });

        if (!order) {
          console.warn(LOG_TAG, "order not found", {
            query,
            order,
          });

          return res.status(400).send({ error: "Order not found" });
        }

        if (order?.status !== "UNFULFILLED") {
          console.warn(LOG_TAG, "order is already fulfullied or cancelled", {
            query,
            order,
          });

          return res
            .status(400)
            .send({ error: "order is already fulfullied or cancelled" });
        }

        const customerDetails = order.customerDetails as any;
        if (customerDetails.email !== body.email) {
          console.warn(LOG_TAG, "wrong order email", {
            query,
            order,
          });

          return res
            .status(400)
            .send({ error: "Order does not belong to this email" });
        }

        // set order to cancelled
        const result = await prisma.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
          select: {
            id: true,
            status: true,
            paymentMethod: true,
            items: true,
            createdAt: true,
            totalAmount: true,
          },
        });

        return res.status(200).send(result);
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
