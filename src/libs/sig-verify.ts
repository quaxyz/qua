// @ts-ignore
import asn1 from "asn1.js";
// @ts-ignore
import BN from "bn.js";

const EcdsaDerSig = asn1.define("ECPrivateKey", function () {
  // @ts-ignore
  return this.seq().obj(this.key("r").int(), this.key("s").int());
});

export function concatSigToAsn1Sig(concatSigBuffer: any) {
  const r = new BN(concatSigBuffer.slice(0, 32).toString("hex"), 16, "be");
  const s = new BN(concatSigBuffer.slice(32).toString("hex"), 16, "be");
  return EcdsaDerSig.encode({ r, s }, "der");
}
