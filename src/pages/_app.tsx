import React from "react";
import type { AppProps } from "next/app";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Hydrate, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { getQueryClient } from "libs/react-query";
import { Analytics } from "@vercel/analytics/react";

function QuaApp({ Component, pageProps = {} }: AppProps) {
  const [queryClient] = React.useState(() => getQueryClient());
  const { dehydratedState, ...rest } = pageProps;

  const Layout = (Component as any).Layout || React.Fragment;
  const layoutProps = pageProps.layoutProps || {};

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <Layout {...layoutProps}>
            <Component {...rest} />
          </Layout>

          <ReactQueryDevtools />
        </Hydrate>
      </QueryClientProvider>

      <Analytics />
    </ChakraProvider>
  );
}

export default QuaApp;
