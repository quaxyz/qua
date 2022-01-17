/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import crypto from "crypto";
import jose from "node-jose";
import * as ethers from "ethers";
import base64url from "base64url";
import { concatSigToAsn1Sig } from "libs/sig-verify";

const LOG_TAG = "[store-update-product]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body, query } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "update product", { body, query });

        // verify address
        if (!ethers.utils.isAddress(body.address)) {
          console.log(LOG_TAG, "[warning]", "invalid address", {
            address: body.address,
          });

          return res.status(400).send({ error: "invalid address" });
        }

        // verify ownership
        const store = await prisma.store.findFirst({
          where: {
            name: query.store as string,
          },
        });
        if (!store || store?.owner !== body.address) {
          console.log(LOG_TAG, "[warning]", "invalid owner address", {
            address: body.address,
          });
          return res.status(400).send({ error: "invalid owner address" });
        }

        // verify user public key
        const user = await prisma.user.findFirst({
          where: {
            address: body.address,
            publicKey: {
              has: body.key,
            },
          },
        });
        if (!user) {
          console.log(LOG_TAG, "[warning]", "invalid public key", {
            store: query.store,
            address: body.address,
            key: body.key,
          });
          return res.status(400).send({ error: "invalid public key" });
        }

        // verify digest
        const encoder = new TextEncoder();
        const recoveredDigest = crypto
          .createHash("sha256")
          .update(encoder.encode(body.payload))
          .digest("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");

        if (body.digest !== recoveredDigest) {
          console.log(LOG_TAG, "[warning]", "digest mismatch", {
            store: query.store,
            address: body.address,
            digest: body.digest,
            recoveredDigest,
          });
          return res.status(400).send({ error: "digest mismatch" });
        }

        // verify signature
        const digestBuffer = crypto
          .createHash("sha256")
          .update(encoder.encode(body.payload))
          .digest();

        const publicKey = (await jose.JWK.asKey(body.key, "json")).toPEM();
        const isValidSignature = crypto.verify(
          "sha256",
          digestBuffer,
          publicKey,
          Buffer.from(
            concatSigToAsn1Sig(base64url.toBuffer(body.signature)),
            "hex"
          )
        );

        if (!isValidSignature) {
          console.log(LOG_TAG, "[warning]", "invalid signature", {
            store: query.store,
            address: body.address,
            signature: body.signature,
          });
          return res.status(400).send({ error: "invalid signature" });
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

        console.log(LOG_TAG, "produt updated", { result });
        return res.status(200).send({ message: "product updated" });
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
