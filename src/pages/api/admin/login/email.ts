/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import sendGrid from "@sendgrid/mail";
import { withSession } from "libs/session";
import { sealData, unsealData } from "iron-session";

const LOG_TAG = "[admin-email-login]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
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

          const { id, email } = await unsealData(token as string, {
            password: process.env.SECRET_COOKIE_PASSWORD || "",
          });

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

          // create session
          req.session.data = {
            userId: user.id,
            email: user.email,
          };
          await req.session.save();

          // redirect to settings
          return res.redirect(`/${store.name}/`);
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
          if (
            !process.env.SECRET_COOKIE_PASSWORD ||
            !process.env.SENDGRID_KEY
          ) {
            throw new Error("Missing env variables");
          }

          sendGrid.setApiKey(process.env.SENDGRID_KEY || "");

          const seal = await sealData(
            {
              id: user.id,
              email: user.email,
            },
            {
              password: process.env.SECRET_COOKIE_PASSWORD || "",
              ttl: 30 * 60, // 30 mins
            }
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
  }
);
