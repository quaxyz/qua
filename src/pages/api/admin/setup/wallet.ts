/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { utils } from "ethers";
import { withSession } from "libs/session";

const LOG_TAG = "[admin-wallet-setup]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body } = req;

      switch (method) {
        case "POST": {
          const { sig, address, message } = body;

          if (!sig || !address || !message) {
            console.error(LOG_TAG, "invalid payload", method);
            return res.status(400).send({ error: "invalid payload" });
          }

          // verify signature
          const recoveredAddress = utils.verifyMessage(message, sig);
          if (address !== recoveredAddress) {
            console.warn(LOG_TAG, "wrong signature", method);
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

          return res.send({
            redirect: true,
            url: `/setup/details`,
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
  }
);
