import { Queue } from "quirrel/next";
import prisma from "libs/prisma";
import LazerPay from "lazerpay-node-sdk";

const lazerPay = new LazerPay(
  process.env.NEXT_PUBLIC_LAZER_PAY_KEY || "",
  process.env.LAZER_PAY_SECRET_KEY || ""
);

const LOG_TAG = "[store-queue-payment-payout]";

export default Queue("/api/queue/payment/payout", async (payload: any) => {
  console.log(LOG_TAG, "[info]", "processing order payload", {
    payload,
  });

  // fetch order
  const order = await prisma.order.findFirst({
    where: { hash: payload.orderHash, Store: { name: payload.storeName } },
    select: { pricingBreakdown: true, storeId: true },
  });

  const store = await prisma.store.findUnique({
    where: { id: order?.storeId },
    select: { owner: true },
  });

  if (!order || !store) {
    throw new Error("Order not found");
  }

  const { subtotal, shipping } = order.pricingBreakdown as any;

  const payoutResponse = await lazerPay.Payment.transferFunds({
    amount: (subtotal || 0) + (shipping || 0),
    coin: payload.coin,
    recipient: store.owner,
    blockchain: "Binance Smart Chain",
  });

  console.log(LOG_TAG, "[info]", "order payout payload", {
    payoutResponse,
    payload,
  });

  if (payoutResponse.status !== "success") {
    throw new Error(payoutResponse.message);
  }
});
