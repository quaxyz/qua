import * as B64js from "base64-js";
import { extractPublicKey } from "./keys";

function bufferTob64Url(buffer: Uint8Array | ArrayBuffer): string {
  return B64js.fromByteArray(new Uint8Array(buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export const signData = async (
  keyPair: CryptoKeyPair | undefined,
  content: any
) => {
  const stringContent = JSON.stringify(content);
  const encoder = new TextEncoder();
  const encodedContent = encoder.encode(stringContent);

  // generate digest for content
  const digestBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    encodedContent
  );

  // generate signature for content
  const rawSignatureBuffer = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    keyPair?.privateKey!,
    digestBuffer
  );
  const rawSignature = new Uint8Array(rawSignatureBuffer);

  const publicKey = await extractPublicKey(keyPair);

  return {
    digest: bufferTob64Url(digestBuffer),
    signature: bufferTob64Url(rawSignature),
    publicKey,
  };
};
