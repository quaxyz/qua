import { domain } from "libs/constants";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const hostname = req.headers.get("host");

  // exclude public files and api routes
  if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {
    const isPublicPages =
      hostname === "localhost:8888" ||
      ["qua.xyz", "www.qua.xyz"].includes(hostname || "");

    if (isPublicPages && !url.pathname.includes("/_store")) {
      console.log("[middleware] rewriting public route %j", { hostname });
      return NextResponse.next();
    }

    // Only redirect in prod since all cookies will be lost when redireting locally
    if (isPublicPages && url.pathname.includes("_store")) {
      const store = url.pathname.split("/")[2];
      const root = "qua.xyz";
      const path = url.pathname.replace(`/_store/${store}`, "/");

      console.log(
        `[middleware] found store from pathname. Redirecting to page https://${store}.${root}${path} %j`,
        { hostname, store, path }
      );

      if (process.env.NODE_ENV === "production") {
        return NextResponse.redirect(`https://${store}.${root}${path}/`);
      } else {
        return NextResponse.next();
      }
    }

    // Get store name from subdomain (e.g. store, umzug360, etc.)
    // For local we get the brand from subdomain
    const store =
      process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
        ? (hostname || "").replace("qua.xyz", "")
        : (hostname || "").replace(`.localhost:8888`, "");

    if (store) {
      console.log(
        `[middleware] found store from domain. Rewriting to page /_store/${store}${url.pathname} %j`,
        { hostname, store }
      );
      url.pathname = `/_store/${store}${url.pathname}`;

      return NextResponse.rewrite(url);
    }

    console.log("[middleware] No store found in url %j", {
      hostname,
      store,
    });
    return new Response(null, { status: 404 });
  }
}
