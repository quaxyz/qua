/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import { utils } from "ethers";
import prisma from "libs/prisma";

const LOG_TAG = "[store-customer-wallet-login]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body } = req;

      switch (method) {
        case "POST": {
          const { sig, address, message } = body;

          if (!sig || !address || !message) {
            console.log(LOG_TAG, "[error]", "invalid payload", method);
            return res.status(400).send({ error: "invalid payload" });
          }

          // verify signature
          const recoveredAddress = utils.verifyMessage(message, sig);
          if (address !== recoveredAddress) {
            console.log(LOG_TAG, "[error]", "wrong signature", method);
            return res.status(400).send({ error: "wrong signature" });
          }

          // store user details
          let user = await prisma.user.upsert({
            where: { address },
            create: { address },
            update: { address },
          });

          req.session.data = {
            userId: user.id,
            address: user.address,
          };
          await req.session.save();
          return res.send({ message: "is logged in" });
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
