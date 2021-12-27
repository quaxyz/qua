import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ReactManager } from "components/wallet/web3-manager";
import { getLibrary } from "libs/wallet";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const Web3ReactProviderDefault = dynamic(
  () => import("components/wallet/network-connector"),
  {
    ssr: false,
  }
);

function QuaApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 240 * 1000,
          retry: 1,
        },
      },
    });
  });

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ReactProviderDefault getLibrary={getLibrary}>
              <Web3ReactManager>
                <Component {...pageProps} />
              </Web3ReactManager>
            </Web3ReactProviderDefault>
          </Web3ReactProvider>

          <ReactQueryDevtools initialIsOpen />
        </Hydrate>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default QuaApp;
