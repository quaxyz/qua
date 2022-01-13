/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-checkout]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "validate details for checkout", { query });

        if (!query.store) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const storeName = query.store as string;
        const address = query.address as string;

        // check if there is a physical product in the cart
        const cart = await prisma.cart.findUnique({
          where: { ownerAddress: address },
          select: { items: true },
        });
        if (!cart) {
          console.log(LOG_TAG, "[error]", "no cart found for this address", {
            query,
          });

          return res.status(400).send({ error: "cart not found" });
        }

        const cartItems = cart.items as any[];
        const hasPhysicalProduct = await prisma.product.findMany({
          where: {
            physical: true,
            id: {
              in: cartItems.map((c) => c.productId),
            },
          },
        });

        const user = await prisma.user.findUnique({
          where: { address },
          select: { shippingDetails: true },
        });
        const hasShippingDetails = !!user?.shippingDetails;

        if (hasPhysicalProduct && !hasShippingDetails) {
          return res.status(200).send({
            redirect: true,
            url: `/shipping`,
          });
        }

        return res.status(200).send({
          redirect: true,
          url: `/payment`,
        });
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
