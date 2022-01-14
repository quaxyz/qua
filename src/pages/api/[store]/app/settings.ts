/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import _pick from "lodash.pick";
import { verifyApiBody } from "./utils";

const LOG_TAG = "[store-settings]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "update store details", { query, body });

        // verify payload
        const verifyResp = await verifyApiBody(body, query.store);
        if (verifyResp !== true) {
          console.log(LOG_TAG, "[warning]", verifyResp.body.error, {
            ...body,
            ...query,
          });

          return res.status(verifyResp.status).send(verifyResp.body);
        }

        // save payload
        const bodyPayload = JSON.parse(body.payload);
        const dbPayload: any = {
          title: bodyPayload.title,
          about: bodyPayload.about,
          deliveryFee: bodyPayload.deliveryFee
            ? parseFloat(bodyPayload.deliveryFee)
            : 0,
          location: bodyPayload.location,
          socialLinks: bodyPayload.socialLinks,
        };

        if (bodyPayload.image) {
          dbPayload.image = {
            connectOrCreate: {
              create: bodyPayload.image,
              where: _pick(bodyPayload.image, ["hash"]),
            },
          };
        }

        const result = await prisma.store.update({
          where: {
            name: query.store as string,
          },

          data: dbPayload,

          include: {
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
};
