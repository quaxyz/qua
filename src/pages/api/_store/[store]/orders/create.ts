/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

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

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body, query } = req;

      switch (method) {
        case "POST": {
          const { data: session } = req.session;
          console.log(LOG_TAG, "create customer orders", {
            query,
            body,
            session,
          });

          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found", {
              query,
              session,
            });

            return res.status(401).send({ error: "User not logged in" });
          }

          if (!query.store) {
            console.log(LOG_TAG, "[warning]", "invalid query", { query });
            return res.status(400).send({ error: "invalid params" });
          }

          // create order
          const shipping = body.shipping;
          const paymentMethod = body.paymentMethod;

          // fetch cart
          const userCart = await prisma.cart.findUnique({
            where: {
              ownerId_storeName: {
                ownerId: session.userId,
                storeName: query.store as string,
              },
            },
            select: { items: true },
          });

          if (!userCart) {
            console.log(LOG_TAG, "[error]", "cart not found", {
              query,
              session,
            });

            return res.status(400).send({ error: "No cart found" });
          }

          const cartItems = userCart.items as any[];
          const cartProducts = await prisma.product.findMany({
            where: {
              Store: {
                name: query.store as string,
              },
              id: {
                in: cartItems.map((c) => c.productId),
              },
            },
            select: {
              id: true,
              name: true,
              price: true,
            },
          });
          const cart = cartProducts.map((p) => {
            const item = cartItems.find((c) => c.productId === p.id);
            return {
              price: p.price,
              name: p.name,
              productId: p.id,
              quantity: item.quantity,
            };
          });

          // verify data
          if (!cart.length) {
            console.log(LOG_TAG, "[error]", "can't create empty order", method);
            return res.status(400).send({ error: "Can't create empty order" });
          }
          // - any other form of validation?

          // calculate pricing
          const pricing = await calculateOrderPricing({
            store: query.store,
            items: cart,
            shipping,
            paymentMethod,
          });

          // order data
          const orderData: any = {
            items: cart,
            customerDetails: shipping,
            subtotal: pricing.subtotal,
            totalAmount: pricing.total,
            pricingBreakdown: pricing,
            status: "UNFULFILLED",
            paymentStatus: "UNPAID",
            paymentMethod,
          };

          // store order in DB
          const result = await prisma.order.create({
            data: {
              ...orderData,
              store: {
                connect: {
                  name: query.store,
                },
              },
              customer: {
                connect: {
                  id: session.userId,
                },
              },
            },
            select: {
              id: true,
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
  }
);
