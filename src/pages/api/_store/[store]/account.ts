/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[store-account]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query, body } = req;

      switch (method) {
        case "POST": {
          const { data: session } = req.session;
          console.log(LOG_TAG, "save user account details", {
            query,
            body,
            session,
          });

          if (!session || !session.userId) {
            console.warn(LOG_TAG, "No logged in user found", {
              query,
              session,
            });

            return res.status(401).send({ error: "User not logged in" });
          }

          if (!query.store) {
            console.log(LOG_TAG, "[warning]", "invalid query", { query });
            return res.status(400).send({ error: "invalid params" });
          }

          const user = await prisma.user.findUnique({
            where: { id: session.userId },
          });

          const details = {
            ...(user ? (user.shippingDetails as any) : {}),
            name: body.name,
            email: body.email,
            phone: body.phone,
            address: body.address,
            deliveryMethod: body.deliveryMethod,
          };

          const result = await prisma.user.update({
            where: { id: session.userId },
            data: { shippingDetails: details },
          });

          console.log(LOG_TAG, "account updated", { result, body });
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
  }
);
