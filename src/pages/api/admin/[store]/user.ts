/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { decodeUserToken } from "libs/jwt";

const LOG_TAG = "[admin-user]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, headers } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "fetch store admin");

        let payload = decodeUserToken(headers.authorization);
        if (!payload) {
          console.warn(LOG_TAG, "No logged in user found");
          return res.send({ user: null });
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
          console.warn(LOG_TAG, "user not owner of store", {
            store: query.store,
            payload,
          });

          return res.status(200).send({ user: null });
        }

        // add extra information as needed
        return res.status(200).send({
          user: {
            id: payload.id,
          },
        });
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
};
