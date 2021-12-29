/* eslint-disable import/no-anonymous-default-export */
import * as ethers from "ethers";
import prisma from "libs/prisma";
import crypto from "crypto";
import jose from "node-jose";
import base64url from "base64url";

// @ts-ignore
import asn1 from "asn1.js";
// @ts-ignore
import BN from "bn.js";

const EcdsaDerSig = asn1.define("ECPrivateKey", function () {
  // @ts-ignore
  return this.seq().obj(this.key("r").int(), this.key("s").int());
});

function concatSigToAsn1Sig(concatSigBuffer: any) {
  const r = new BN(concatSigBuffer.slice(0, 32).toString("hex"), 16, "be");
  const s = new BN(concatSigBuffer.slice(32).toString("hex"), 16, "be");
  return EcdsaDerSig.encode({ r, s }, "der");
}

export async function verifyApiBody(body: any, storeName: any) {
  // verify address
  if (!ethers.utils.isAddress(body.address)) {
    return { status: 400, body: { error: "invalid address" } };
  }

  // verify store ownership
  const store = await prisma.store.findFirst({
    where: {
      name: storeName as string,
    },
  });
  if (!store || store?.owner !== body.address) {
    return { status: 400, body: { error: "invalid owner address" } };
  }

  // verify user public key
  const user = await prisma.user.findFirst({
    where: {
      address: body.address,
      publicKey: {
        has: body.key,
      },
    },
  });
  if (!user) {
    return { status: 400, body: { error: "invalid public key" } };
  }

  // verify digest
  const encoder = new TextEncoder();
  const recoveredDigest = crypto
    .createHash("sha256")
    .update(encoder.encode(body.payload))
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  if (body.digest !== recoveredDigest) {
    return { status: 400, body: { error: "digest mismatch" } };
  }

  // verify signature
  const digestBuffer = crypto
    .createHash("sha256")
    .update(encoder.encode(body.payload))
    .digest();

  const publicKey = (await jose.JWK.asKey(body.key, "json")).toPEM();
  const isValidSignature = crypto.verify(
    "sha256",
    digestBuffer,
    publicKey,
    Buffer.from(concatSigToAsn1Sig(base64url.toBuffer(body.signature)), "hex")
  );

  if (!isValidSignature) {
    return { status: 400, body: { error: "invalid signature" } };
  }

  return true;
}

export default async (req: any, res: any) => res.sendStatus(404);
