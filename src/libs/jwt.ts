import jwt from "jsonwebtoken";

export function encodeData(
  data: string | object | Buffer,
  options?: jwt.SignOptions
) {
  if (!process.env.AUTH_KEY) {
    throw new Error("AUTH_KEY not found");
  }

  return jwt.sign(data, process.env.AUTH_KEY, options);
}

export function decodeData(token: string) {
  if (!process.env.AUTH_KEY) {
    throw new Error("AUTH_KEY not found");
  }

  return jwt.verify(token, process.env.AUTH_KEY) as jwt.JwtPayload;
}
