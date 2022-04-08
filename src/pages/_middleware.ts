import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents. This can also be done
  // via rewrites to a custom 404 page
  if (url.pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get("host");

  // exclude public files and api routes
  if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {
    const subdomains = (hostname || "").split(".").slice(0, -1);

    // we take the first valid site in the subdomains list
    const site =
      process.env.NODE_ENV !== "production" ? subdomains[0] : subdomains[1];

    // if we don't have a site or site is www we continue to the p
    if (!site || site === "www") {
      console.log("[middleware] no subdomain found, continuing request", {
        hostname,
      });
      return NextResponse.next();
    }

    // if we have a site we rewrite to the site
    console.log(
      "[middleware] Rewriting to page %s %j",
      `/_sites/${site}${url.pathname}`,
      { hostname, site }
    );
    url.pathname = `/_sites/${site}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}
