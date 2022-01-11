import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ReactManager } from "components/wallet/web3-manager";
import { getLibrary } from "libs/wallet";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const Web3ReactProviderDefault = dynamic(
  () => import("components/wallet/network-connector"),
  {
    ssr: false,
  }
);

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
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactProviderDefault getLibrary={getLibrary}>
            <Web3ReactManager>
              <Layout {...layoutProps}>
                <Component {...pageProps} />
              </Layout>
            </Web3ReactManager>
          </Web3ReactProviderDefault>
        </Web3ReactProvider>

        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default QuaApp;
