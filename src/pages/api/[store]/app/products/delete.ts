/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { verifyApiBody } from "../utils";

const LOG_TAG = "[store-delete-product]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body, query } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "deleting product", { body, query });

        // verify payload
        const verifyResp = await verifyApiBody(body, query.store);
        if (verifyResp !== true) {
          console.log(LOG_TAG, "[warning]", verifyResp.body.error, {
            ...body,
            ...query,
          });

          return res.status(verifyResp.status).send(verifyResp.body);
        }

        const payload = JSON.parse(body.payload);
        const result = await prisma.product.delete({
          where: { id: parseInt(payload.id as string, 10) },
        });

        console.log(LOG_TAG, "product deleted", { result });
        return res.status(200).send({ message: "Product deleted" });
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
