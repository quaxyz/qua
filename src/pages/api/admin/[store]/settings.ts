/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import _pick from "lodash.pick";
import { withSession } from "libs/session";
import { revalidate } from "libs/revalidate";

const LOG_TAG = "[admin-store-settings]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query, body } = req;

      switch (method) {
        case "POST": {
          console.log(LOG_TAG, "update store details", {
            query,
            body,
          });

          const { data: session } = req.session;
          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found");
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
            });

            return res.send({ redirect: true, url: "/login" });
          }

          // save payload
          const dbPayload: any = {
            title: body.title,
            about: body.about,
            deliveryFee: body.deliveryFee ? parseFloat(body.deliveryFee) : 0,
            location: body.location,
            currency: body.currency,
            socialLinks: body.socialLinks,
            bankDetails: body.bankDetails,
            image: body.image,
          };

          if (body.address) {
            dbPayload.owner = {
              update: {
                address: body.address,
              },
            };
          }

          const result = await prisma.store.update({
            where: {
              name: query.store as string,
            },

            data: dbPayload,

            include: {
              owner: {
                select: {
                  email: true,
                  address: true,
                },
              },
            },
          });

          // revalidate about product pages
          if (process.env.NODE_ENV === "production") {
            try {
              console.log(LOG_TAG, "revalidate about page", {
                store: store.name,
              });

              await revalidate(
                `https://${store.name}.${process.env.NEXT_PUBLIC_DOMAIN}`,
                store.name
              );
            } catch (err) {
              console.error(LOG_TAG, "error revalidating store", {
                store: store.name,
                err,
              });
            }
          }

          console.log(LOG_TAG, "settings updated", { result });
          return res
            .status(200)
            .send({ message: "settings updated", settings: result });
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
