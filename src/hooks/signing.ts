import Api from "libs/api";
import { useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "react-query";
import { useStoreAuth } from "./auth";
import { providers } from "ethers";
import { domain, schemas } from "libs/constants";
import { extractPublicKey, generateKeyPair, saveKeyPair } from "libs/keys";

export function useCreateSigningKey() {
  const toast = useToast();
  const router = useRouter();
  const { library, account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const storeAuth = useStoreAuth();

  const addSigningKeyMutation = useMutation(async (payload: any) => {
    return Api().post(`/dashboard/add-signing-key`, payload);
  });

  const createSigningKey = async () => {
    if (!library || !account) {
      toast({
        title: "Error generating signing key account",
        description: "No account connected",
        position: "bottom-right",
        status: "error",
      });

      return null;
    }

    setLoading(true);
    try {
      const keyPair = await generateKeyPair();
      const publicKey = await extractPublicKey(keyPair);
      console.log("PubKey", { address: account, publicKey });

      let provider: providers.Web3Provider = library;
      const signer = provider.getSigner(account);

      // format message into schema
      const message = {
        from: account,
        timestamp: parseInt((Date.now() / 1000).toFixed()),
        store: router.query?.store,
        publicKey: JSON.stringify(publicKey),
      };

      const data = {
        domain,
        types: { GenerateSigningKey: schemas.GenerateSigningKey },
        message,
      };

      const sig = await signer._signTypedData(
        data.domain,
        data.types,
        data.message
      );
      console.log("Sig", { address: account, sig, data });

      // send signature to backend
      const { payload: result } = await addSigningKeyMutation.mutateAsync({
        address: account,
        sig,
        data,
      });

      console.log("Result", result);

      // store keys
      await saveKeyPair(keyPair);
      storeAuth?.setPublicKey(JSON.stringify(publicKey));
    } catch (e: any) {
      toast({
        title: "Error generating keys",
        description: e.message,
        position: "bottom-right",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createSigningKey, loading };
}
