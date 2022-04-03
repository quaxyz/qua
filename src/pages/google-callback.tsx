import { NextPage } from "next/types";

const Page: NextPage = () => null;

/**
 * This page is meant to be open in a popup. The purpose of this page is to send back the google oauth2 response
 * back to the popup parent. Which will be in a subdomain ([store].qua.xyz).
 *
 * Why? Well the browser doesn't allow cross-origin browser reading any more, so there's no way for
 * the parent to see the url params of this page
 *
 * Read more:
 * https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
 */
const generatedHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Redirecting to site...</title>

    <script>
      const { path } = JSON.parse(new URLSearchParams(window.location.search).get("state") || "{}");
      const payload = {
        code: "oauth2_login_success",
        search: decodeURIComponent(window.location.search),
      };

      window.opener.postMessage(payload, path);
      console.log("sent message", payload, path);
    </script>
  </head>
  <body>
  </body>
`;

Page.getInitialProps = async ({ req, res }) => {
  if (!res) return {};

  // send a custom html script to be excuted immediately
  res.setHeader("Content-Type", "text/html");
  res.write(generatedHtml);
  res.end();
};

export default Page;
