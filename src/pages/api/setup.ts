/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import prisma from "libs/prisma";

const LOG_TAG = "[store-setup]";

const DOMAIN_NAME = "Qua";
const DOMAIN_VERSION = "1.0.0";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "setup store", { body });

        const { domain, message, types } = body.data;

        // verify timestamp
        const ts = Date.now() / 1000;
        const overTs = (ts + 180).toFixed(); // +3 min
        const underTs = (ts - 180).toFixed(); /// -3 min

        if (message.timestamp > overTs || message.timestamp < underTs) {
          console.log(LOG_TAG, "[error]", "wrong timestamp", method);
          return res.status(400).send({ error: "wrong timestamp" });
        }

        // verify domain
        if (domain.name !== DOMAIN_NAME || domain.version !== DOMAIN_VERSION) {
          console.log(LOG_TAG, "[error]", "wrong doamin", method);
          return res.status(400).send({ error: "wrong domain" });
        }

        // verify signature
        const recoveredAddress = utils.verifyTypedData(
          domain,
          types,
          message,
          body.sig
        );
        if (body.address !== recoveredAddress) {
          console.log(LOG_TAG, "[error]", "wrong signature", method);
          return res.status(400).send({ error: "wrong signature" });
        }

        const data = JSON.parse(message.details);

        // verify data
        // - check if store name is unique
        // - any other form of validation?
        if (await prisma.store.findUnique({ where: { name: data.name } })) {
          return res.status(400).send({ error: "name already in use" });
        }

        // store data in DB
        const result = await prisma.store.create({
          data: {
            name: data.name,
            email: data.email,
            owner: body.address,
            category: data.category,
          },
        });

        console.log(LOG_TAG, "store created", { result });

        return res.status(200).send({ message: "store created" });
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
