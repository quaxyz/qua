import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents. This can also be done
  // via rewrites to a custom 404 page
  if (url.pathname.startsWith(`/_store`)) {
    return new Response(null, { status: 404 });
  }

  const hostname = req.headers.get("host");

  // exclude public files and api routes
  if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {
    if (
      hostname === "localhost:8888" ||
      ["qua.xyz", "www.qua.xyz"].includes(hostname || "")
    ) {
      console.log("[middleware] rewriting public route %j", { hostname });
      return NextResponse.next();
    }

    // Get store name (e.g. store, umzug360, etc.)
    // For local we get the brand from subdomain
    const store =
      process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
        ? (hostname || "").replace("qua.xyz", "")
        : (hostname || "").replace(`.localhost:8888`, "");

    if (!store) {
      console.log("[middleware] No store found in url %j", { hostname, store });
      return new Response(null, { status: 404 });
    }

    console.log(
      `[middleware] Rewriting to page /_store/${store}${url.pathname} %j`,
      { hostname, store }
    );
    url.pathname = `/_store/${store}${url.pathname}`;

    return NextResponse.rewrite(url);
  }
}
