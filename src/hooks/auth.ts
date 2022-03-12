import Api from "libs/api";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { destroyKeyPair, extractPublicKey, getKeyPair } from "libs/keys";
import { AuthContext } from "contexts/auth";
import { COOKIE_STORAGE_NAME, toBase64 } from "libs/cookie";
import { useEagerConnect } from "hooks/web3";
import { useGoogleLogin } from "react-google-login";
import { useToast, useDisclosure } from "@chakra-ui/react";
import { injected, switchNetwork } from "libs/wallet";
import { providers } from "ethers";

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

export const useGoogleAuthSetup = () => {
  const handleResponse = useCallback((resp) => {
    const payload = jwt.decode(resp.credential);
    console.log("Google auth", resp);
  }, []);

  useEffect(() => {
    global.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleResponse,
    });

    global.google?.accounts.id.prompt();
  }, [handleResponse]);
};

export const useGoogleAuth = () => {
  const toast = useToast();
  const googleAuthMutation = useMutation(
    async (data: any) => {
      const { payload } = await Api().post("/auth/google", {
        googleId: data.tokenId,
      });

      if (!payload.token) {
        throw new Error("No token returned from server");
      }

      // store token in cookie
      Cookies.set(
        COOKIE_STORAGE_NAME,
        toBase64({ token: payload.token, email: data.email }),
        {
          expires: 365 * 10,
          secure: true,
        }
      );

      return payload.token;
    },
    {
      onError: (err) => {
        toast({
          title: "Error Signing up",
          description: "Something went wrong authenicating with Google",
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  const { loaded, signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    onSuccess: (resp) => googleAuthMutation.mutateAsync(resp),
    onFailure: (err) => {
      toast({
        title: "Error Signing up",
        description: "Something went wrong authenicating with Google",
        position: "bottom-right",
        status: "error",
      });
    },
  });

  return {
    ready: loaded,
    loading: googleAuthMutation.isLoading,
    signIn,
  };
};

export const useWalletAuth = () => {
  // ask user to sign data and send to the backend
  const toast = useToast();
  const [pending, setPending] = useState<boolean>(false);
  const { activate, library, account } = useWeb3React();
  const connectModal = useDisclosure();

  const walletAuthMutation = useMutation(async (account: string) => {
    // ask user to sign message
    let provider: providers.Web3Provider = library;
    const signer = provider.getSigner(account!);

    const message = "Please sign this message to confirm you own this wallet";
    const sig = await signer.signMessage(message);

    console.log("Sign", { sig, address: account });

    const { payload } = await Api().post("/auth/wallet", {
      address: account,
      sig,
      message,
    });

    if (!payload.token) {
      throw new Error("No token returned from server");
    }

    // store token in cookie
    Cookies.set(
      COOKIE_STORAGE_NAME,
      toBase64({ token: payload.token, address: account }),
      {
        expires: 365 * 10,
        secure: true,
      }
    );

    return payload.token;
  });

  const tryActivate = async (connector?: any) => {
    if (!connector) return;
    setPending(true);

    // activate wallet
    try {
      await activate(connector, undefined, true);
    } catch (error) {
      if (connector === injected && error instanceof UnsupportedChainIdError) {
        await switchNetwork();
        await activate(injected, (err) => {
          toast({
            title: "Error connecting account",
            description: err.message,
            position: "bottom-right",
            status: "error",
          });
        });
      }
    } finally {
      setPending(false);
      connectModal.onClose();
    }
  };

  useEffect(() => {
    if (!account) return;
    walletAuthMutation.mutate(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return {
    isLoading: pending || walletAuthMutation.isLoading,
    isModalOpen: connectModal.isOpen,
    onModalClose: connectModal.onClose,
    onModalOpen: connectModal.onOpen,
    activate: tryActivate,
  };
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
