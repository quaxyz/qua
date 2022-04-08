/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { utils } from "ethers";
import { encodeData } from "libs/jwt";

const LOG_TAG = "[admin-wallet-login]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
        let user = await prisma.user.findFirst({
          where: { address },
        });
        if (!user) {
          console.warn(LOG_TAG, "no user not found for provided address");

          return res
            .status(400)
            .send({ error: "No user found for this wallet address" });
        }

        const store = await prisma.store.findFirst({
          where: {
            owner: {
              id: user.id,
            },
          },
        });
        if (!store) {
          console.warn(LOG_TAG, "No store found for user", {
            userId: user.id,
          });

          return res.status(400).send({
            error:
              "You haven't created any store, please create a store and try again",
          });
        }

        // generate jwt token for user
        const userToken = encodeData({ id: user.id }, { expiresIn: "60d" });

        // send user to settings page and set the token
        return res.send({
          token: userToken,
          store: store.name,
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
