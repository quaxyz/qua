import Api from "libs/api";
import Cookies from "js-cookie";
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { destroyKeyPair, extractPublicKey, getKeyPair } from "libs/keys";
import { AuthContext } from "libs/auth";
import { COOKIE_STORAGE_NAME } from "libs/cookie";
import { useEagerConnect } from "hooks/web3";

export function useInitializeStoreAuth() {
  const [publicKey, setPublicKey] = useState<string | null>();
  const { active, account } = useWeb3React();

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  const { isLoading, data } = useQuery({
    queryKey: ["verify-store-owner", account],
    enabled: !!account,
    staleTime: Infinity,
    queryFn: async () => {
      const { payload } = await Api().get(
        `/app/verify-owner?address=${account}`
      );

      return payload;
    },
  });

  // initialize the public key
  useEffect(() => {
    const fn = async () => {
      const keyPair = await getKeyPair();
      if (!keyPair) {
        setPublicKey(null);
      } else {
        const pKey = await extractPublicKey(keyPair);
        setPublicKey(pKey ? JSON.stringify(pKey) : null);
      }
    };

    fn();
  }, [account]);

  let status = "";

  // check if the user has a signing key stored
  if (!publicKey) {
    status = "no-signing-key";
  }

  if (data === false) {
    status = "not-owner";
  }

  if (!account) {
    status = "no-account";
  }

  return useMemo(
    () => ({
      loading: (!active && !triedEager) || isLoading || publicKey === undefined,
      status,
      publicKey,
      setPublicKey,
    }),
    [active, triedEager, status, isLoading, publicKey, setPublicKey]
  );
}

export function useStoreAuth() {
  const authContext = useContext(AuthContext);
  return authContext;
}

export function useLogout() {
  const storeAuth = useStoreAuth();
  const { deactivate } = useWeb3React();

  return async () => {
    Cookies.remove(COOKIE_STORAGE_NAME);

    if (storeAuth) {
      await destroyKeyPair();
      storeAuth?.setPublicKey(null);
    }

    deactivate();
  };
}
