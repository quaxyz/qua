/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import LazerPay from "lazerpay-node-sdk";

const LOG_TAG = "[store-confirm-payment]";
const lazerPay = new LazerPay(
  process.env.NEXT_PUBLIC_LAZER_PAY_KEY || "",
  process.env.LAZER_PAY_SECRET_KEY || ""
);

/**
 * {
    "payload": {
        "id": "759abd34-2539-485e-bebe-727c228a42ca",
        "reference": "DFcYtfpOhH",
        "senderAddress": "0xb63F27E0E5A4c463e056DC835821f0BEE339406A",
        "recipientAddress": "0x50b90C51C1c354324370Deec108Aff9eD3BF8bf1",
        "actualAmount": 1,
        "amountPaid": 1,
        "fiatAmount": 1,
        "coin": "USDT",
        "currency": "USD",
        "hash": "0x80e2d72143643aa352eb0bf54d910bee9119f2c464fcb3504943ad03f7a836f3",
        "blockNumber": 15949654,
        "type": "received",
        "status": "confirmed",
        "network": "testnet",
        "blockchain": "Binance Smart Chain",
        "customer": {
            "id": "247ef5f2-b5fd-4bb4-850d-851462fb0e21",
            "customerName": "Marvin Kome",
            "customerEmail": "marvinkome@gmail.com",
            "customerPhone": null,
            "network": "testnet"
        }
    }
}
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body, query } = req;

    switch (method) {
      case "POST": {
        console.log(LOG_TAG, "process payment with crypto %j", { body });
        if (!query.store) {
          console.log(LOG_TAG, "[warning]", "invalid query", { query });
          return res.status(400).send({ error: "invalid params" });
        }

        const { orderHash, paymentPayload } = body;
        const { coin, reference, recipientAddress } = paymentPayload;

        try {
          // confirm payment
          const confirmationPayload = await lazerPay.Payment.confirmPayment({
            address: recipientAddress,
          });

          if (confirmationPayload.status !== "confirmed") {
            throw new Error("Payment is not yet confirmed");
          }
        } catch (error) {
          console.log(LOG_TAG, "[error]", "error confirming payment", {
            query,
            body,
            error,
          });
          return res.status(400).send({ error: "Error confirming payment" });
        }

        // get order
        const order = await prisma.order.findUnique({
          where: { hash: orderHash },
          select: { subtotal: true, pricingBreakdown: true, storeId: true },
        });

        // get seller info
        const store = await prisma.store.findUnique({
          where: { id: order?.storeId },
          select: { owner: true },
        });

        // send subtotal + shipping  to seller
        if (!store?.owner) {
          console.log(LOG_TAG, "[error]", "no store owner found", {
            query,
            body,
          });
          return res.status(400).send({ error: "Error confirming payment" });
        }

        let payoutHash = "";
        try {
          const transferResponse = await lazerPay.Payment.transferFunds({
            amount: 0,
            coin: coin,
            recipient: store.owner,
            blockchain: "Binance Smart Chain",
          });

          if (transferResponse.status !== "success") {
            throw new Error(transferResponse.message);
          }

          payoutHash = transferResponse.data.transactionHash;
        } catch (error) {
          console.log(
            LOG_TAG,
            "[error]",
            "error transferring funds to seller",
            {
              query,
              body,
              error,
            }
          );
          return res.status(500).send({ error: "Error processing payment" });
        }

        // store payment reference in order
        // store payout hash
        // set status to paid
        const result = await prisma.order.update({
          where: { hash: orderHash },
          data: {
            payoutHash,
            paymentReference: reference,
            paymentStatus: "PAID",
          },
        });

        console.log(LOG_TAG, "payment processed created", { result });
        return res.status(200).send({ message: "Payment processed" });
      }
      default:
        console.log(LOG_TAG, "[error]", "unauthorized method", method);
        return res.status(500).send({ error: "unauthorized method" });
    }
  } catch (error) {
    console.log(LOG_TAG, "[error]", "general error", {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    return res.status(500).send({ error: "request failed" });
  }
};
