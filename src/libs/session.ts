// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "qua",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const withSession = (fn: any) =>
  withIronSessionApiRoute(fn, sessionOptions);

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    data?: {
      userId?: number;
      email?: string | null;
      address?: string | null;
    };
  }
}
