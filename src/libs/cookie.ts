import nextCookies from "next-cookies";
import Cookies from "js-cookie";

export const COOKIE_STORAGE_NAME = "QUA_WALLET";

export function fromBase64(s: string | undefined) {
  const stringifiedCookie = Buffer.from(s || "", "base64").toString();
  const asObject = JSON.parse(stringifiedCookie || "{}");

  return asObject;
}

export function toBase64(o: any): string {
  const stringified = JSON.stringify(o || {});
  const base64 = Buffer.from(stringified).toString("base64");
  return base64;
}

export function getAddressFromCookie(serverSide: boolean, context?: any) {
  const cookie = serverSide
    ? nextCookies(context!)[COOKIE_STORAGE_NAME]
    : Cookies.get(COOKIE_STORAGE_NAME);

  const { address } = fromBase64(cookie) as any;

  return address;
}
