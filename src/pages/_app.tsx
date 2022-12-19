import React from "react";
import type { AppProps } from "next/app";
import GA from "libs/ga";
import Script from "next/script";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Hydrate, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { getQueryClient } from "libs/react-query";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/router";

function QuaApp({ Component, pageProps = {} }: AppProps) {
  const router = useRouter();

  const [queryClient] = React.useState(() => getQueryClient());
  const { dehydratedState, ...rest } = pageProps;

  const Layout = (Component as any).Layout || React.Fragment;
  const layoutProps = pageProps.layoutProps || {};

  React.useEffect(() => {
    const pageView = (url: string) => {
      GA.pageView(url);
    };

    router.events.on("routeChangeComplete", pageView);
    return () => {
      router.events.off("routeChangeComplete", pageView);
    };
  }, [router]);

  return (
    <>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState}>
            <Layout {...layoutProps}>
              <Component {...rest} />
            </Layout>

            <ReactQueryDevtools />
            {process.env.NODE_ENV === "production" && (
              <Script
                strategy="afterInteractive"
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              ></Script>
            )}

            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];

                  function gtag(){
                    dataLayer.push(arguments);
                  }
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            ></Script>
          </Hydrate>
        </QueryClientProvider>
      </ChakraProvider>

      <Analytics />
    </>
  );
}

export default QuaApp;
