/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[customer-order-payment]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "customer order payment", {
          query,
          body,
        });

        if (!query.store || !query.id) {
          console.warn(LOG_TAG, "invalid query", { query });
          return res.status(400).send({ error: "Invalid query" });
        }

        // fetch order
        const order = await prisma.order.findUnique({
          where: { publicId: query.id as string },
          include: {
            store: true,
          },
        });

        if (!order) {
          console.warn(LOG_TAG, "order not found", { query });
          return res
            .status(400)
            .send({ error: "No order not found for this id" });
        }

        const customerDetails = body.customerDetails;
        const paymentMethod = body.paymentMethod;

        if (!customerDetails || !paymentMethod) {
          console.warn(LOG_TAG, "invalid payload", { customerDetails });
          return res.status(400).send({ error: "Invalid payload" });
        }

        // TODO: validate customer details
        // TODO: validate payment method

        // calculate pricing
        const subtotal = order.subtotal;

        let shippingFee = 0;
        if (customerDetails.deliveryMethod === "DOOR_DELIVERY") {
          shippingFee = order.store.deliveryFee ?? 0;
        }

        let fees = 0;
        if (paymentMethod === "CRYPTO") {
          fees = (subtotal || 0) * 0.01;
        }

        const pricingBreakdown = {
          subtotal,
          shipping: shippingFee,
          fees,
          total: subtotal + fees + shippingFee,
        };

        let paymentStatus = order.paymentStatus;
        if (paymentMethod !== "CRYPTO" && paymentStatus !== "PAID") {
          paymentStatus = "PAY_LATER";
        }

        // save order customer details, shipping details and payment
        const newOrder = await prisma.order.update({
          where: { publicId: query.id as string },
          data: {
            totalAmount: pricingBreakdown.total,
            paymentMethod,
            paymentStatus,
            pricingBreakdown,
            customerDetails: {
              name: customerDetails.name,
              phone: customerDetails.phone,
              email: customerDetails.email,
              address: customerDetails.address,
              deliveryMethod: customerDetails.deliveryMethod,
            },
          },
        });

        console.log(LOG_TAG, "Order saved", { result: newOrder });

        return res.status(200).send({
          id: newOrder.publicId,
        });
      }
      default: {
        console.error(LOG_TAG, "unauthorized method", method);
        return res.status(500).send({ error: "unauthorized method" });
      }
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
