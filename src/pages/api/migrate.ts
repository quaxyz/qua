/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import groupBy from "lodash.groupby";

const LOG_TAG = "[migrate]";

// async function migrateImages() {
//   // fetch all images with productId
//   // convert the productId to be in the products array

//   const images = await prisma.image.findMany({
//     where: {
//       NOT: {
//         productId: null,
//       },
//     },
//   });

//   const productsId = groupBy(images, "productId");

//   await Promise.all(
//     Object.entries(productsId).map(async ([id, images]) => {
//       await prisma.product.update({
//         where: { id: Number(id) },
//         data: {
//           newImages: images.map((image) => image.url),
//         },
//       });
//     })
//   );
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET": {
        if (query.key !== process.env.MIGRATE_KEY) {
          return res.status(404).send({ error: "invalid key" });
        }

        // migrate
        // await migrateImages();

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
