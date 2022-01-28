/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { fromBase64 } from "libs/cookie";

const LOG_TAG = "[store-customer-orders]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "fetch store customer orders", { query });

        if (!query.store || !query.cursor) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const { address } = fromBase64(req.cookies["QUA_WALLET"] || "");
        if (!address || !address.length) {
          console.log(LOG_TAG, "[warning]", "address not found in cookie", {
            cookie: req.cookies,
          });

          // we send 200 not to trigger an error on the client side
          return res.status(200).send([]);
        }

        const store = query.store as string;
        const orders = await prisma.order.findMany({
          // pagination
          take: 10,
          skip: 1,
          cursor: {
            id: parseInt(query.cursor as string, 10),
          },

          where: { customerAddress: address, Store: { name: store } },
          orderBy: { updatedAt: "desc" },
          select: { id: true, status: true, paymentStatus: true, items: true },
        });

        const itemsIds: any[] = orders
          .map((o: any) => (o.items[0] || {}).productId)
          .filter((i) => Boolean(i));
        const products = await prisma.product.findMany({
          where: {
            Store: {
              name: store,
            },
            id: {
              in: itemsIds,
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            totalStocks: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        });

        const formatedOrders = [];
        for (let order of orders) {
          const product = products.find(
            (p) => p.id === ((order.items || [{}]) as any)[0].productId
          );
          if (!product) continue;

          formatedOrders.push({
            id: order?.id,
            status: order?.status,
            paymentStatus: order?.paymentStatus,
            product: {
              id: product?.id,
              name: product?.name,
              image: product?.images[0]?.url,
            },
          });
        }

        console.log(LOG_TAG, "[info]", "returning orders", {
          orders: formatedOrders,
        });
        return res.status(200).send(formatedOrders);
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
