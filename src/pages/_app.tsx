import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ReactManager } from "components/wallet/web3-manager";
import { getLibrary } from "libs/wallet";
import { QueryClient, QueryClientProvider } from "react-query";

const Web3ReactProviderDefault = dynamic(() => import("components/wallet/network-connector"), {
  ssr: false,
});

const queryClient = new QueryClient();

function QuaApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactProviderDefault getLibrary={getLibrary}>
            <Web3ReactManager>
              <Component {...pageProps} />
            </Web3ReactManager>
          </Web3ReactProviderDefault>
        </Web3ReactProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default QuaApp;
