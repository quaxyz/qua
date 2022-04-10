/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import crypto from "crypto";

const LOG_TAG = "[store-checkout]";

function generatePublicId() {
  const chars = "BCDEFGHJKLMNOPQRSTVWXYZ023456789bcdefghjklmnopqrstvwxyz";

  let randStr = "qua";
  while (randStr.length < 32) {
    // eslint-disable-next-line no-await-in-loop
    const idx = crypto.randomInt(0, chars.length - 1);
    randStr += chars.substring(idx, idx + 1);
  }

  return randStr;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "validate details for checkout", {
          query,
          body,
        });

        if (!query.store) {
          console.warn(LOG_TAG, "invalid query", { query });
          return res.status(400).send({ error: "No store found in query" });
        }

        if (!body.items || !body.items.length) {
          console.warn(LOG_TAG, "invalid body", { body });
          return res.status(400).send({ error: "No items to checkout" });
        }

        const storeName = query.store as string;
        const orderId = (body.orderId as string) || generatePublicId();
        const items = body.items;

        // fetch store
        const store = await prisma.store.findUnique({
          where: {
            name: storeName,
          },
          select: {
            id: true,
          },
        });

        if (!store) {
          console.warn(LOG_TAG, "store not found", { store });
          return res.status(400).send({ error: "No store found" });
        }

        // generate cart items details
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: items.map((item: any) => item.productId),
            },
          },

          select: {
            id: true,
            name: true,
            price: true,
            totalStocks: true,
            totalSold: true,
          },
        });

        const cartProducts = products.map((product) => {
          const item = items.find((item: any) => item.productId === product.id);

          return {
            productId: product.id,
            quantity: item.quantity,
            name: product.name,
            price: product.price,
            subtotal: product.price * item.quantity,
            outOfStock: product.totalStocks === 0,
          };
        });

        // check if they're products out of stock
        if (cartProducts.some((p) => p.outOfStock)) {
          console.warn(LOG_TAG, "contains products out of stock", {
            cartProducts,
          });

          return res.status(400).send({ error: "Some items are out of stock" });
        }

        // calculate total and prices
        const itemTotal = cartProducts.reduce((acc, p) => acc + p.subtotal, 0);

        // create order and redirect to payment page
        const order = await prisma.order.upsert({
          where: { publicId: orderId },
          create: {
            storeId: store.id,
            publicId: orderId,
            items: cartProducts,
            subtotal: itemTotal,
            totalAmount: itemTotal, // we set it to the item amount for now and update as user adds more data
            pricingBreakdown: {
              subtotal: itemTotal,
              shipping: 0,
              fees: 0,
              total: itemTotal + 0 + 0,
            },
          },
          update: {
            storeId: store.id,
            items: cartProducts,
            subtotal: itemTotal,
            customerDetails: {},
            totalAmount: itemTotal, // we set it to the item amount for now and update as user adds more data
            pricingBreakdown: {
              subtotal: itemTotal,
              shipping: 0,
              fees: 0,
              total: itemTotal + 0 + 0,
            },
          },
        });

        return res.status(200).send({
          redirect: true,
          url: `/orders/${order.publicId}/payment`,
        });
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
};
