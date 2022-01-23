import React from "react";
import { useInactiveListener } from "hooks/web3";

export function Web3ReactManager(props: { children: React.ReactElement }) {
  useInactiveListener();

  return props.children;
}
