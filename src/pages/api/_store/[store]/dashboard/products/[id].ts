/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { verifyApiBody } from "../utils";

const LOG_TAG = "[store-update-product]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body, query } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "update product", { body, query });

        // verify payload
        const verifyResp = await verifyApiBody(body, query.store);
        if (verifyResp !== true) {
          console.log(LOG_TAG, "[warning]", verifyResp.body.error, {
            ...body,
            ...query,
          });

          return res.status(verifyResp.status).send(verifyResp.body);
        }

        // TODO:: validate input
        const payload = JSON.parse(body.payload);

        if (payload.variants) {
          // check for invalid variants
          const invalidVariants = payload.variants.filter((variant: any) => {
            if (!variant.type || !variant.type.length) return true;
            if (!variant.options || !variant.options.length) return true;
          });

          if (invalidVariants.length > 0) {
            console.log(LOG_TAG, "[error]", "invalid payload: variants", {
              store: query.store,
              address: body.address,
              payload,
            });
            return res.status(400).send({ error: "invalid payload: variants" });
          }

          // transform object
          payload.variants = payload.variants.map((variant: any) => ({
            type: variant.type,
            options: variant.options
              .split(",")
              .map((option: string) => option.trim()),
          }));
        }

        // save data and upsert images
        const [result] = await prisma.$transaction([
          prisma.product.update({
            where: {
              id: parseInt(query.id as string, 10),
            },
            data: {
              name: payload.name,
              price: parseFloat(payload.price),
              physical: payload.physical,

              description: payload.description,
              discountPrice: payload.discountPrice
                ? parseFloat(payload.discountPrice)
                : undefined,

              totalStocks: payload.stock ? parseInt(payload.stock) : undefined,
              category: payload.category,
              tags: payload.tags?.split(",").map((t: string) => t.trim()) || [],
              variants: payload.variants,
            },
          }),

          ...(payload.images || []).map((image: any) =>
            prisma.image.upsert({
              where: { hash: image.hash },
              update: { ...image },
              create: { ...image, productId: parseInt(query.id as string, 10) },
            })
          ),
        ]);

        console.log(LOG_TAG, "product updated", { result });
        return res.status(200).send({ message: "product updated" });
      }

      case "DELETE": {
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

        const result = await prisma.product.delete({
          where: { id: parseInt(query.id as string, 10) },
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
