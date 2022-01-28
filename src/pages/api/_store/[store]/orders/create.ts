/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import { domain } from "libs/constants";
import crypto from "crypto";
import prisma from "libs/prisma";

const LOG_TAG = "[store-orders]";

async function calculateOrderPricing({
  items,
  shipping,
  paymentMethod,
  store,
}: any) {
  // calculate subtotal
  const subtotal = items.reduce((total: any, item: any) => {
    return total + item.price * item.quantity;
  }, 0);

  // get shipping fee
  let shippingFee = 0;
  if (shipping.deliveryMethod === "DOOR_DELIVERY") {
    const { deliveryFee } =
      (await prisma.store.findUnique({
        where: { name: store },
        select: { deliveryFee: true },
      })) || {};

    if (deliveryFee) shippingFee = deliveryFee;
  }

  let fees = 0;
  if (paymentMethod === "CRYPTO") {
    fees = (subtotal || 0) * 0.01;
  }

  return {
    subtotal,
    shipping: shippingFee,
    fees,
    total: (subtotal || 0) + fees + shippingFee,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body, query } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "create customer order %j", { body });
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

        // create order
        const cart = JSON.parse(data.message.cart);
        const shipping = JSON.parse(data.message.shipping);
        const paymentMethod = data.message.paymentMethod;

        // verify data
        if (!cart.length) {
          console.log(LOG_TAG, "[error]", "can't create empty order", method);
          return res.status(400).send({ error: "can't create empty order" });
        }
        // - any other form of validation?

        // calculate pricing
        const pricing = await calculateOrderPricing({
          store: data.message.store,
          items: cart,
          shipping,
          paymentMethod,
        });

        // order data
        const orderData: any = {
          items: cart,
          customerAddress: address,
          customerDetails: shipping,
          subtotal: pricing.subtotal,
          totalAmount: pricing.total,
          pricingBreakdown: pricing,
          status: "UNFULFILLED",
          paymentStatus: "UNPAID",
          paymentMethod,
        };

        // hash order
        const encoder = new TextEncoder();
        const digest = crypto
          .createHash("sha256")
          .update(
            encoder.encode(
              JSON.stringify({
                ...orderData,
                timestamp: data.message.timestamp,
                store: data.message.store,
              })
            )
          )
          .digest("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");

        // store order in DB
        const result = await prisma.order.create({
          data: {
            ...orderData,
            hash: digest,
            Store: {
              connect: {
                name: data.message.store,
              },
            },
          },
          select: {
            id: true,
            hash: true,
            totalAmount: true,
          },
        });

        console.log(LOG_TAG, "order created", { result });
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
