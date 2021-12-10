import Api from "libs/api";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { extractPublicKey, getKeyPair } from "libs/keys";

export function useInitializeStoreAuth() {
  const router = useRouter();
  const [publicKey, setPublicKey] = useState<string | null>();
  const { account } = useWeb3React();

  const { isLoading, data } = useQuery({
    queryKey: "verify-store-owner",
    enabled: !!account,
    queryFn: async () => {
      const { payload } = await Api().get(
        `/api/${router.query?.store}/verify-owner?address=${account}`
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
  if (!account) {
    status = "no-account";
  }

  if (data === false) {
    status = "not-owner";
  }

  // check if the user has a signing key stored
  if (!publicKey) {
    status = "no-signing-key";
  }

  return useMemo(
    () => ({
      loading: isLoading || publicKey === undefined,
      status,
      publicKey,
      setPublicKey,
    }),
    [status, isLoading, publicKey, setPublicKey]
  );
}
