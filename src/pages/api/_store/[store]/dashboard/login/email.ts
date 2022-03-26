/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import sendGrid from "@sendgrid/mail";
import { withSession } from "libs/session";
import { sealData, unsealData } from "iron-session";

const LOG_TAG = "[store-dashboard-email-login]";

/**
 * Since we don't plan on authenicating now, we just need to create the
 * user and in the session so a store can be created.
 */
export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query, body } = req;

      switch (method) {
        case "GET": {
          const { token } = query;
          console.log(LOG_TAG, "processing magic link from user", {
            store: query.store,
          });

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
              name: query.store as string,
              owner: {
                id: user.id,
              },
            },
          });

          if (!store) {
            console.warn(LOG_TAG, "User not owner of the store");
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

          // parse token and create session
          return res.redirect("/dashboard");
        }
        case "POST": {
          const { email } = body;
          console.log(LOG_TAG, "sending magic link to user", { query });

          // find or create user
          const user = await prisma.user.upsert({
            where: { email: email },
            create: { email },
            update: {},
          });

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
          const store = query.store as string;
          const proto = req.headers["x-forwarded-proto"] ? "https" : "http";
          await sendGrid.send({
            to: email,
            from: process.env.SENDGRID_EMAIL || "",
            templateId: "d-9446ba50f4bb40508c0d03f59c2545c8",
            dynamicTemplateData: {
              link: `${proto}://${store}.${process.env.NEXT_PUBLIC_DOMAIN}/api/_store/${store}/dashboard/login/email?token=${seal}`,
            },
          });

          return res.send({
            message: "Email sent",
          });
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
