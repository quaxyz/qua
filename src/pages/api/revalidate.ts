import type { NextApiRequest, NextApiResponse } from "next";
const LOG_TAG = "[revalidate]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { urlPath } = req.body;

  try {
    await res.revalidate(urlPath);

    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.log(LOG_TAG, "[error]", "general error", {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    res.status(500).json({
      message: `Failed to revalidate "${urlPath}"`,
    });
  }
}
