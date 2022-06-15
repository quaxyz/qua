import React from "react";
import type { AppProps } from "next/app";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Hydrate, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { getQueryClient } from "libs/react-query";

function QuaApp({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppProps) {
  const [queryClient] = React.useState(() => getQueryClient());

  const Layout = (Component as any).Layout || React.Fragment;
  const layoutProps = pageProps.layoutProps;

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <Layout {...layoutProps}>
            <Component {...pageProps} />
          </Layout>

          {/* <ReactQueryDevtools /> */}
        </Hydrate>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default QuaApp;
