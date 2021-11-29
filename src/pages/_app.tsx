import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ReactManager } from "components/wallet/web3-manager";
import { getLibrary } from "libs/wallet";

const Web3ReactProviderDefault = dynamic(() => import("components/wallet/network-connector"), {
  ssr: false,
});

function QuaApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactProviderDefault getLibrary={getLibrary}>
          <Web3ReactManager>
            <Component {...pageProps} />
          </Web3ReactManager>
        </Web3ReactProviderDefault>
      </Web3ReactProvider>
    </ChakraProvider>
  );
}

export default QuaApp;
