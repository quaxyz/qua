/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import prisma from "libs/prisma";

const LOG_TAG = "[store-add-signing-key]";

const DOMAIN_NAME = "Qua";
const DOMAIN_VERSION = "1.0.0";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body, query } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "adding device signing key", { body });

        const { domain, message, types } = body.data;

        // verify timestamp
        const ts = Date.now() / 1000;
        const overTs = (ts + 180).toFixed(); // +3 min
        const underTs = (ts - 180).toFixed(); /// -3 min

        if (message.timestamp > overTs || message.timestamp < underTs) {
          console.log(LOG_TAG, "[warning]", "wrong timestamp", method);
          return res.status(400).send({ error: "wrong timestamp" });
        }

        // verify domain
        if (domain.name !== DOMAIN_NAME || domain.version !== DOMAIN_VERSION) {
          console.log(LOG_TAG, "[warning]", "wrong doamin", method);
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
          console.log(LOG_TAG, "[warning]", "wrong signature", method);
          return res.status(400).send({ error: "wrong signature" });
        }

        // verify store owner
        const data = await prisma.store.findFirst({
          where: {
            name: query.store as string,
          },
        });

        if (data?.owner !== body.address) {
          return res.status(400).send({ error: "invalid owner address" });
        }

        // store public key in relation to user
        const result = await prisma.user.upsert({
          where: {
            address: body.address,
          },
          update: {
            publicKey: {
              push: message.publicKey,
            },
          },
          create: {
            address: body.address,
            publicKey: [message.publicKey],
          },
        });

        console.log(LOG_TAG, "added device signing key", { result });

        return res.status(200).send({ message: "signing key stored" });
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
