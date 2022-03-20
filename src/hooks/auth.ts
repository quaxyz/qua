import Api from "libs/api";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { destroyKeyPair, extractPublicKey, getKeyPair } from "libs/keys";
import { AuthContext } from "contexts/auth";
import { COOKIE_STORAGE_NAME } from "libs/cookie";
import { useEagerConnect } from "hooks/web3";
import { useToast } from "@chakra-ui/react";

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
        `/dashboard/verify-owner?address=${account}`
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

declare global {
  var google: any;
}

export const useGoogleOneTap = (isLoggedIn: boolean) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const googleAuthMutation = useMutation(
    async (data: any) => {
      console.log(data);
      await Api().post("/login/google", {
        token: data.credential,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("customer-data");
      },

      onError: (err: any) => {
        toast({
          title: "Error login in",
          description: err?.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  useEffect(() => {
    if (isLoggedIn) return;

    global.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (resp: any) => googleAuthMutation.mutateAsync(resp),
    });

    global.google?.accounts.id.prompt();
  }, [googleAuthMutation, isLoggedIn]);
};

export const useStoreUser = () => {
  return useQuery({
    queryKey: ["store-user"],
    staleTime: 0, // always stale
    cacheTime: 0,
    queryFn: async () => {
      const { payload } = await Api().get(`/dashboard/user`);
      return payload;
    },
  });
};

export const useCustomerData = () => {
  return useQuery({
    queryKey: ["customer-data"],
    staleTime: 0, // always stale
    cacheTime: 0,
    queryFn: async () => {
      const { payload } = await Api().get(`/user`);
      return payload;
    },
  });
};

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
