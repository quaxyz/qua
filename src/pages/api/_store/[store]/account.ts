/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { domain } from "libs/constants";
import { utils } from "ethers";

const LOG_TAG = "[store-account]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "store user account details", { query });
        if (!query.store) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const { data, address, sig } = body;

        // verify timestamp
        const ts = Date.now() / 1000;
        const overTs = (ts + 180).toFixed(); // +3 min
        const underTs = (ts - 180).toFixed(); /// -3 min

        if (
          data.message.timestamp > overTs ||
          data.message.timestamp < underTs
        ) {
          console.log(LOG_TAG, "[error]", "wrong timestamp", method);
          return res.status(400).send({ error: "wrong timestamp" });
        }

        // verify domain
        if (
          domain.name !== data.domain.name ||
          domain.version !== data.domain.version
        ) {
          console.log(LOG_TAG, "[error]", "wrong doamin", method);
          return res.status(400).send({ error: "wrong domain" });
        }

        // verify signature
        const recoveredAddress = utils.verifyTypedData(
          domain,
          data.types,
          data.message,
          sig
        );
        if (address !== recoveredAddress) {
          console.log(LOG_TAG, "[error]", "wrong signature", method);
          return res.status(400).send({ error: "wrong signature" });
        }

        const payload = JSON.parse(data.message.details);
        const user = await prisma.user.findUnique({ where: { address } });
        const details = {
          ...(user ? (user.shippingDetails as any) : {}),
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          deliveryMethod: payload.deliveryMethod,
        };

        const result = await prisma.user.upsert({
          where: { address },
          create: { address, shippingDetails: details },
          update: { shippingDetails: details },
        });

        console.log(LOG_TAG, "account updated", { result, data });
        return res.status(200).send({ message: "saved" });
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
