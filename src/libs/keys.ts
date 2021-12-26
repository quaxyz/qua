import { del, get, set } from "idb-keyval";

const storageKey = "qua-signingKey";

export const generateKeyPair = async () => {
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    false,
    ["sign", "verify"]
  );
};

export const extractPublicKey = async (keyPair: CryptoKeyPair | undefined) => {
  if (!keyPair?.publicKey) throw Error("No public key to extract");
  return await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
};

export const saveKeyPair = async (keyPair: CryptoKeyPair) => {
  return await set(storageKey, keyPair);
};

export const getKeyPair = async (): Promise<CryptoKeyPair | undefined> => {
  const keyPair = await get<CryptoKeyPair>(storageKey);
  return keyPair;
};

export const destroyKeyPair = async () => await del(storageKey);
