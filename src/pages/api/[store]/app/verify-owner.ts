/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[store-verify-owner]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        console.log(LOG_TAG, "verify store owner", { query });

        if (!query.address) {
          console.log(LOG_TAG, "[warning]", "no address in the query");
          return res.status(200).send(false);
        }

        const data = await prisma.store.findFirst({
          where: {
            name: query.store as string,
          },
        });

        if (data?.owner !== query.address) {
          return res.status(200).send(false);
        }

        return res.status(200).send(true);
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
