/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import _pick from "lodash.pick";
import { verifyApiBody } from "./utils";
import { withSession } from "libs/session";

const LOG_TAG = "[store-settings]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query, body } = req;

      switch (method) {
        case "POST": {
          const { data: session } = req.session;
          console.log(LOG_TAG, "update store details", {
            query,
            body,
            session,
          });

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

          // save payload
          const dbPayload: any = {
            title: body.title,
            about: body.about,
            deliveryFee: body.deliveryFee ? parseFloat(body.deliveryFee) : 0,
            location: body.location,
            socialLinks: body.socialLinks,
            bankDetails: body.bankDetails,
          };

          if (body.address) {
            dbPayload.owner = {
              update: {
                address: body.address,
              },
            };
          }

          if (body.image) {
            dbPayload.image = {
              connectOrCreate: {
                create: body.image,
                where: _pick(body.image, ["hash"]),
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
              image: {
                select: {
                  url: true,
                },
              },
            },
          });

          console.log(LOG_TAG, "settings updated", { result });
          return res
            .status(200)
            .send({ message: "settings updated", settings: result });
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
