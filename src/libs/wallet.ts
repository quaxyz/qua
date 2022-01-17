import * as ethers from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

// CONSTANTS
export const DEFAULT_CHAIN_ID = 1;
export const RPC_URLS: { [chainId: number]: string } = {
  1: "https://mainnet.infura.io/v3/4f88abdfd94a43c684fa93091d00515e", // mainnet
  4: "https://rinkeby.infura.io/v3/4f88abdfd94a43c684fa93091d00515e", // rinkeby
  56: "https://bsc-dataseed.binance.org/", // bsc
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/", // bsc testnet
};

// CONNECTORS
export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: DEFAULT_CHAIN_ID,
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 56, 97], // todo:: add more selected chain IDs
});

// wallet info
interface WalletInfo {
  name: string;
  label?: string;
  connector?: any;
  iconUrl?: string;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: "Injected",
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    label: "Sign in with MetaMask",
    iconUrl: "/wallets/metamask.png",
  },
};

// helper methods
export function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export async function switchNetwork() {
  const { ethereum } = global as any;
  if (!ethereum) {
    console.log("MetaMask extension not available");
    return;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(DEFAULT_CHAIN_ID).toString(16)}` }],
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((error as any).code === 4902) {
      //
    }
  }
}

export async function addTokenToWallet(
  address: string,
  symbol: string,
  decimals?: string,
  image?: string
) {
  const { ethereum } = global as any;
  if (!ethereum) {
    console.log("MetaMask extension not available");
    return;
  }

  try {
    const success = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          symbol,
          decimals: decimals || 18,
          image,
        },
      },
    });

    if (success) {
      console.log("token successfully added to wallet!");
    }
  } catch (error) {
    console.error(error);
  }
}
