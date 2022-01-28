import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host");

  // if it's localhost don't do anything
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  // Get the custom domain/subdomain value by removing the root URL
  // (in the case of "test.qua.xyz", "qua.xyz" is the root URL)
  const storeFromDomain =
    process.env.NODE_ENV === "production"
      ? hostname?.replace(`.${process.env.ROOT_URL}`, "")
      : undefined;

  // Handle public routes
  if (
    (!storeFromDomain || storeFromDomain === "www") &&
    !pathname.startsWith("/_store")
  ) {
    return NextResponse.next();
  }

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents. This can also be done
  // via rewrites to a custom 404 page
  console.log("[middleware] handle _store redirects", {
    storeFromDomain,
    pathname,
  });
  if (
    storeFromDomain &&
    storeFromDomain !== "www" &&
    pathname.startsWith("/_store")
  ) {
    const newPath = `${hostname}${pathname.replace("/_store", "")}`;
    console.log(
      "[middleware] its a store with subdomain, redirect to correct path",
      {
        storeFromDomain,
        pathname,
        newPath,
      }
    );
    return NextResponse.rewrite(newPath);
  }
  if (storeFromDomain === "www" && pathname.startsWith("/_store")) {
    const store = pathname.split("/")[2];
    const newPath = `${hostname?.replace("www.", store)}${pathname.replace(
      "/_store",
      ""
    )}`;

    console.log(
      "[middleware] its a store without subdomain, redirect to correct path",
      {
        storeFromDomain,
        pathname,
        newPath,
      }
    );

    return NextResponse.rewrite(newPath);
  }

  // exclude public files and api routes
  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    // rewrite to the current hostname under the pages/sites folder
    // the main logic component will happen in pages/sites/[site]/index.tsx
    return NextResponse.rewrite(`/_store/${storeFromDomain}${pathname}`);
  }
}
