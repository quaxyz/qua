import React from "react";
import type { AppProps } from "next/app";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 240 * 1000,
      retry: 1,
    },
  },
});

function QuaApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || React.Fragment;
  const layoutProps = pageProps.layoutProps;

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Layout {...layoutProps}>
          <Component {...pageProps} />
        </Layout>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default QuaApp;
