/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { verifyApiBody } from "../utils";

const LOG_TAG = "[store-dashboard-fulfill-order]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "cancel store order", { query, body });

        // verify payload
        const verifyResp = await verifyApiBody(body, query.store);
        if (verifyResp !== true) {
          console.log(LOG_TAG, "[warning]", verifyResp.body.error, {
            ...body,
            ...query,
          });

          return res.status(verifyResp.status).send(verifyResp.body);
        }

        const storeName = query.store as string;
        const { orderId } = JSON.parse(body.payload);

        const order = await prisma.order.findFirst({
          where: {
            id: parseInt(orderId, 10),
            Store: {
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
            "Order is already fulfullied or cancelled",
            { query, order }
          );

          return res.status(400).send({
            error: "order is already fulfullied or cancelled",
          });
        }

        // set order to cancelled
        const result = await prisma.order.update({
          where: { id: order.id },
          data: { status: "FULFILLED", paymentStatus: "PAID" },
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
};
