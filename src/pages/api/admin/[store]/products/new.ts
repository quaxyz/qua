/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";
import { revalidate } from "libs/revalidate";

const LOG_TAG = "[admin-add-product]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body, query } = req;

      switch (method) {
        case "POST": {
          console.log(LOG_TAG, "add new product", {
            query,
            body,
          });

          // verify session
          const { data: session } = req.session;
          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found", {
              query,
              session,
            });
            return res.send({ redirect: true, url: "/login" });
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

            return res.send({ redirect: true, url: "/login" });
          }

          if (body.variants) {
            // check for invalid variants
            const invalidVariants = body.variants.filter((variant: any) => {
              if (!variant.type || !variant.type.length) return true;
              if (!variant.options || !variant.options.length) return true;
              if (variant.options.some((o: any) => o.option === ""))
                return true;
            });

            if (invalidVariants.length > 0) {
              console.error(LOG_TAG, "invalid body", {
                store: query.store,
                address: body.address,
                body,
              });
              return res.status(400).send({ error: "invalid body: variants" });
            }

            // transform object
            body.variants = body.variants.map((variant: any) => ({
              type: variant.type,
              options: variant.options,
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
              images: body.images.map((image: any) => image.url),

              Store: {
                connect: {
                  id: store.id,
                },
              },
            },
          });

          // revalidate store product pages
          if (process.env.NODE_ENV === "production") {
            try {
              console.log(LOG_TAG, "revalidate store pages", {
                store: store.name,
              });

              await revalidate(
                `https://${store.name}.${process.env.NEXT_PUBLIC_DOMAIN}`
              );
            } catch (err) {
              console.error(LOG_TAG, "error revalidating store pages", {
                store: store.name,
                err,
              });
            }
          }

          console.log(LOG_TAG, "product created", { result });
          return res
            .status(200)
            .send({ product: result, message: "product created" });
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
  }
);
