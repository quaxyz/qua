// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

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

export const withSsrSession = <
  P extends {
    [key: string]: unknown;
  } = {
    [key: string]: unknown;
  }
>(
  fn: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => withIronSessionSsr<P>(fn, sessionOptions);

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
