import { withSession } from "libs/session";
import prisma from "libs/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const LOG_TAG = "[dashboard-user]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query } = req;

      switch (method) {
        case "GET": {
          console.log(LOG_TAG, "fetch store owner", { query });

          const { data: sessionData } = req.session;

          if (!sessionData || (!sessionData?.address && !sessionData?.email)) {
            console.warn(LOG_TAG, "no logged in user found", {
              query,
              session: sessionData,
            });
            return res.send({ user: null });
          }

          // verify store owner
          const data = await prisma.store.findFirst({
            where: {
              name: query.store as string,
              owner: sessionData.address || sessionData.email || undefined,
            },
          });

          if (!data) {
            return res.status(200).send({ user: null });
          }

          return res.status(200).send({ user: sessionData });
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
