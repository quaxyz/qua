/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-shipping]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "validate details for checkout", { query });

        if (!query.store || !query.address) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const address = query.address as string;
        const shippingDetails = body.map((d: any) => ({
          name: d.name,
          email: d.email,
          phone: d.phone,
          address: d.address,
          deliveryMethod: d.deliveryMethod,
        }));

        await prisma.user.upsert({
          where: { address },
          create: { address, shippingDetails },
          update: { shippingDetails },
        });

        return res.status(200).send({ message: "saved" });
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
