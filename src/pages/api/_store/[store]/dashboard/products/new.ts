/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[store-add-product]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body, query } = req;

      switch (method) {
        case "POST": {
          const { data: session } = req.session;
          console.log(LOG_TAG, "add new product", {
            query,
            body,
            session,
          });

          // verify session
          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found", {
              query,
              session,
            });
            return res.send({ redirect: true, url: "/dashboard/login" });
          }

          // verify store owner
          const store = await prisma.store.findFirst({
            where: {
              name: query.store as string,
              owner: {
                id: session.userId,
              },
            },
          });
          if (!store) {
            console.warn(LOG_TAG, "User not owner of the store", {
              query,
              session,
            });

            return res.send({ redirect: true, url: "/dashboard/login" });
          }

          if (body.variants) {
            // check for invalid variants
            const invalidVariants = body.variants.filter((variant: any) => {
              if (!variant.type || !variant.type.length) return true;
              if (!variant.options || !variant.options.length) return true;
            });

            if (invalidVariants.length > 0) {
              console.log(LOG_TAG, "[error]", "invalid body", {
                store: query.store,
                address: body.address,
                body,
              });
              return res.status(400).send({ error: "invalid body: variants" });
            }

            // transform object
            body.variants = body.variants.map((variant: any) => ({
              type: variant.type,
              options: variant.options
                .split(",")
                .map((option: string) => option.trim()),
            }));
          }

          // save data
          const result = await prisma.product.create({
            data: {
              name: body.name,
              price: parseFloat(body.price),
              physical: body.physical,
              description: body.description,
              discountPrice: body.discountPrice
                ? parseFloat(body.discountPrice)
                : undefined,
              totalStocks: body.stock ? parseInt(body.stock) : undefined,
              category: body.category,
              tags: body.tags?.split(",").map((t: string) => t.trim()) || [],
              variants: body.variants,

              images: {
                connectOrCreate: body.images.map((image: any) => ({
                  where: { hash: image.hash },
                  create: image,
                })),
              },

              Store: {
                connect: {
                  id: store.id,
                },
              },
            },
          });

          console.log(LOG_TAG, "product created", { result });
          return res.status(200).send({ message: "product created" });
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
