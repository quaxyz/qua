/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";

const LOG_TAG = "[migrate]";

async function migrateOwner() {
  const allStores = await prisma.store.findMany({
    where: {
      owner_old: {
        not: null,
      },
    },
  });

  // migrate owner_old
  for (let store of allStores) {
    const { owner_old, name } = store;
    console.log(LOG_TAG, `migrating store: store (${name}) ${owner_old}`);

    // find user
    let user = await prisma.user.findFirst({
      where: {
        address: owner_old,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: owner_old,
        },
      });
    }

    // connect store owner
    await prisma.store.update({
      where: {
        id: store.id,
      },
      data: {
        owner_old: null,
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        if (query.key !== process.env.MIGRATE_KEY) {
          return res.status(404).send({ error: "invalid key" });
        }

        // migrate
        await migrateOwner();

        return res.status(200).send({ message: "migrated" });
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
