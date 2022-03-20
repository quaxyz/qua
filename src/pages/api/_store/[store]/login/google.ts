/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import { OAuth2Client } from "google-auth-library";
import prisma from "libs/prisma";

const LOG_TAG = "[store-customer-google-login]";

const authClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body } = req;

      switch (method) {
        case "POST": {
          const { token } = body;

          if (!token) {
            return res.status(400).send({ error: "missing token" });
          }

          // validate the id token
          const ticket = await authClient.verifyIdToken({
            idToken: token,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();

          const googleId = payload?.sub;
          const email = payload?.email;

          // store user details
          let user = await prisma.user.upsert({
            where: { email },
            create: { email, googleId },
            update: { email, googleId },
          });

          req.session.data = {
            userId: user.id,
            email: user.email,
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
