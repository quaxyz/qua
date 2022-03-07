/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import prisma from "libs/prisma";
import jwt from "jsonwebtoken";

const LOG_TAG = "[auth-google]";

const authClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;

    switch (method) {
      case "POST": {
        const { token } = body;

        if (!token) {
          return res.status(400).send({ error: "missing googleId" });
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
        let user = await prisma.user.findFirst({
          where: { email },
        });

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId, email },
          });
        } else {
          user = await prisma.user.create({
            data: { googleId, email },
          });
        }

        // generate jwt token for user
        const jwtToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
            address: "",
          },
          process.env.AUTH_KEY || "",
          { expiresIn: "10days" }
        );

        return res.send({ token: jwtToken });
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
