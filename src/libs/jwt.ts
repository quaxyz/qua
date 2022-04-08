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

export function decodeUserToken(authHeader?: string) {
  const token = (authHeader || "").split(" ")[1];
  if (!token) {
    console.warn(
      "[decodeHeaderToken]",
      "Invalid authorization header. No token found"
    );
    return null;
  }

  let payload;
  try {
    payload = decodeData(token as string);
  } catch (e) {
    console.warn(
      "[decodeHeaderToken]",
      "Invalid authorization header. Invalid token"
    );
    return null;
  }

  return payload as jwt.JwtPayload;
}
