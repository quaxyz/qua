import React, { useEffect, useState } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEagerConnect, useInactiveListener } from "hooks/web3";

export function Web3ReactManager(props: { children: React.ReactElement }) {
  const { active } = useWeb3React<providers.Web3Provider>();

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }

  // if neither context is active, spin
  if (!active) {
    return showLoader ? (
      <Flex
        m="auto"
        w="50%"
        align="center"
        justify="center"
        h="100vh"
        direction="column"
      >
        <Spinner size="lg" />
        <Text mt={4}>Loading...</Text>
      </Flex>
    ) : null;
  }

  return props.children;
}
