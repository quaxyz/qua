/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { utils } from "ethers";
import { domain } from "libs/constants";

const LOG_TAG = "[store-orders-cancel]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "customer cancel order", { query });

        if (!query.store) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const { data, address, sig } = body;

        // verify timestamp
        const ts = Date.now() / 1000;
        const overTs = (ts + 180).toFixed(); // +3 min
        const underTs = (ts - 180).toFixed(); /// -3 min

        if (
          data.message.timestamp > overTs ||
          data.message.timestamp < underTs
        ) {
          console.log(LOG_TAG, "[error]", "wrong timestamp", method);
          return res.status(400).send({ error: "wrong timestamp" });
        }

        // verify domain
        if (
          domain.name !== data.domain.name ||
          domain.version !== data.domain.version
        ) {
          console.log(LOG_TAG, "[error]", "wrong doamin", method);
          return res.status(400).send({ error: "wrong domain" });
        }

        // verify signature
        const recoveredAddress = utils.verifyTypedData(
          domain,
          data.types,
          data.message,
          sig
        );
        if (address !== recoveredAddress) {
          console.log(LOG_TAG, "[error]", "wrong signature", method);
          return res.status(400).send({ error: "wrong signature" });
        }

        const storeName = query.store as string;
        const { orderId } = data.message;

        const order = await prisma.order.findFirst({
          where: {
            id: parseInt(orderId, 10),
            customerAddress: recoveredAddress,
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
};
