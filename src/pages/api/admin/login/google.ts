/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { OAuth2Client } from "google-auth-library";
import { withSession } from "libs/session";

const LOG_TAG = "[admin-google-login]";

const authClient = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL
);

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body } = req;

      switch (method) {
        case "POST": {
          const { code } = body;

          if (!code) {
            console.warn(LOG_TAG, "no code found in payload", {
              body,
            });
            return res.status(400).json({ error: "Login failed" });
          }

          // get user
          const { tokens } = await authClient.getToken(code as string);
          if (!tokens.id_token) {
            console.warn(LOG_TAG, "Invalid code in payload", {
              body,
            });
            return res.status(400).json({
              error: "Login failed",
            });
          }

          // validate the id token
          const ticket = await authClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();

          const googleId = payload?.sub;
          const email = payload?.email;

          // find user
          let user = await prisma.user.findFirst({
            where: { email },
          });
          if (!user) {
            console.warn(LOG_TAG, "no user not found for provided email");

            return res
              .status(400)
              .send({ error: "No user found for this email address" });
          }

          // store googleId if user exists
          if (!user.googleId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { googleId },
            });
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

          req.session.data = {
            userId: user.id,
            email: user.email,
          };
          await req.session.save();

          return res.send({
            redirect: true,
            url: `/${store.name}/`,
          });
        }
        default:
          console.warn(LOG_TAG, "unauthorized method", method);
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
