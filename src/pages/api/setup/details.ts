/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[setup-details]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, body } = req;

      switch (method) {
        case "POST": {
          console.log(LOG_TAG, "setup store", { body });

          console.log(
            "no session",
            !req.session.data ||
              (!req.session.data?.address && !req.session.data?.email)
          );

          if (
            !req.session.data ||
            (!req.session.data?.address && !req.session.data?.email)
          ) {
            console.warn(LOG_TAG, "no store owner found, redirect to login", {
              body,
              session: req.session.data,
            });
            return res.send({
              redirect: true,
              url: `/setup`,
            });
          }

          // verify data
          // - check if store name is unique
          // - any other form of validation?
          if (await prisma.store.findUnique({ where: { name: body.name } })) {
            console.warn(LOG_TAG, "store name already in user", { body });
            return res.status(400).send({ error: "name already in use" });
          }

          // store data in DB
          const result = await prisma.store.create({
            data: {
              name: body.name?.toLowerCase(),
              email: req.session.data.email,
              owner:
                req.session.data.address || req.session.data.email || undefined,
              category: body.category,
            },
          });

          console.log(LOG_TAG, "store created", { result });

          return res.status(200).send({ message: "store created" });
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
