/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import sendGrid from "@sendgrid/mail";
import { encodeData, decodeData } from "libs/jwt";

const LOG_TAG = "[admin-email-login]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query, body } = req;

    switch (method) {
      case "GET": {
        const { token } = query;
        console.log(LOG_TAG, "processing magic link from user");

        if (!token) {
          console.warn(LOG_TAG, "No token found");
          return res.status(404).send({ error: "not found" });
        }

        let id;
        let email;
        try {
          ({ id, email } = decodeData(token as string));
        } catch (e) {
          console.error(LOG_TAG, "Error decoding token", e);
          return res.status(400).send({ error: "invalid token" });
        }

        // store user details
        let user = await prisma.user.findFirst({
          where: { id: parseInt(id as string, 10), email: email as string },
        });

        if (!user) {
          console.warn(LOG_TAG, "user not found");
          return res.status(404).send({ error: "not found" });
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

          return res.status(404).send({
            error: "not found",
          });
        }

        // generate jwt token for user
        const userToken = encodeData({ id: user.id }, { expiresIn: "60d" });

        // send user to settings page and set the token
        return res.send(`
          <script>
            localStorage.setItem('QUA_AUTH', '${userToken}');
            document.location = '/${store.name}/settings';
          </script>
        `);
      }
      case "POST": {
        const { email } = body;
        console.log(LOG_TAG, "sending magic link to user");

        // find or create user
        const user = await prisma.user.findFirst({
          where: { email: email },
        });

        if (!user) {
          console.warn(LOG_TAG, "No user found for this email");
          return res
            .status(401)
            .send({ error: "No user found with this email" });
        }

        // create magic link
        if (!process.env.SECRET_COOKIE_PASSWORD || !process.env.SENDGRID_KEY) {
          throw new Error("Missing env variables");
        }

        sendGrid.setApiKey(process.env.SENDGRID_KEY || "");

        const seal = encodeData(
          { id: user.id, email: user.email },
          { expiresIn: "30m" }
        );

        // send email to the user
        const proto = req.headers["x-forwarded-proto"] ? "https" : "http";
        await sendGrid.send({
          to: email,
          from: process.env.SENDGRID_EMAIL || "",
          templateId: "d-9446ba50f4bb40508c0d03f59c2545c8",
          dynamicTemplateData: {
            link: `${proto}://admin.${process.env.NEXT_PUBLIC_DOMAIN}/api/admin/login/email?token=${seal}`,
          },
        });

        return res.send({
          message: "Please check your inbox to continue login",
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
