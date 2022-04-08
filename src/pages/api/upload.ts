/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import mime from "mime-types";
import fleekStorage from "@fleekhq/fleek-storage-js";
import AWS from "aws-sdk";

const LOG_TAG = "[upload]";

const ACCEPTED_TYPES = ["png", "pdf", "jpg", "jpeg", "webp"];

function getBuffer(req: NextApiRequest) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", (err) => reject(err));
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, query } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "uploading file", { query });

        const contentType = req.headers["content-type"];
        const ext = mime.extension(contentType as string);

        if (!ACCEPTED_TYPES.includes(ext as string)) {
          console.log(LOG_TAG, "[warning]", "content-type not allowed");
          return res.status(415).send({ error: "invalid content type" });
        }

        const name = (query.filename as string).replace(/\.[^/.]+$/, "");
        const filename = `qua/${query.bucket}/${name}.${ext}`;

        const content = (await getBuffer(req)) as Buffer;

        // --- 1024 x 1024 x 5 = 5242880 (5mb)
        const MAX_FILE_SIZE = 5242880;
        const fileSize = Buffer.byteLength(content);

        if (fileSize > MAX_FILE_SIZE) {
          console.log(LOG_TAG, "[error]", "size limit exceeded");
          return res
            .status(415)
            .send({ error: "file is too large. Max limit is 5mb" });
        }

        // const s3 = new AWS.S3({
        //   apiVersion: "2006-03-01",
        //   accessKeyId: process.env.FLEEK_API_KEY || "",
        //   secretAccessKey: process.env.FLEEK_API_SECRET || "",
        //   endpoint: "https://storageapi2.fleek.co",
        //   region: "us-east-1",
        //   s3ForcePathStyle: true,
        // });

        // const request = s3.putObject({
        //   Bucket: "marvinkome-team-bucket",
        //   Key: filename,
        //   Body: content,
        //   ACL: "public-read",
        // });

        const uploadedFile = await fleekStorage.upload({
          apiKey: process.env.FLEEK_API_KEY || "",
          apiSecret: process.env.FLEEK_API_SECRET || "",
          key: filename,
          data: content,
        });

        console.log(LOG_TAG, "uploaded file", { uploadedFile });
        return res.status(200).send({
          ...uploadedFile,
          publicUrl: `https://storageapi2.fleek.co/${uploadedFile.bucket}/${uploadedFile.key}`,
        });
      }

      case "DELETE": {
        console.log(LOG_TAG, "deleting file", { query });

        await fleekStorage.deleteFile({
          apiKey: process.env.FLEEK_API_KEY || "",
          apiSecret: process.env.FLEEK_API_SECRET || "",
          key: query.filename as string,
        });

        return res.status(200).send({ message: "file deleted" });
      }

      default:
        console.log(LOG_TAG, "[error]", "unauthorized method", method);
        return res.status(400).send({ error: "unauthorized method" });
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

export const config = {
  api: {
    bodyParser: false,
  },
};
