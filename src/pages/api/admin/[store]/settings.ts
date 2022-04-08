/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import _pick from "lodash.pick";
import { withSession } from "libs/session";
import { decodeUserToken } from "libs/jwt";

const LOG_TAG = "[admin-store-settings]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query, body, headers } = req;

      let payload = decodeUserToken(headers.authorization);
      if (!payload) {
        console.warn(LOG_TAG, "No logged in user found");
        return res.send({ redirect: true, url: "/login" });
      }

      switch (method) {
        case "POST": {
          console.log(LOG_TAG, "update store details", {
            query,
            body,
          });

          let payload = decodeUserToken(headers.authorization);
          if (!payload) {
            console.warn(LOG_TAG, "No logged in user found");
            return res.send({ redirect: true, url: "/login" });
          }

          // verify store owner
          const store = await prisma.store.findFirst({
            where: {
              name: query.store as string,
              owner: {
                id: payload.id,
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
