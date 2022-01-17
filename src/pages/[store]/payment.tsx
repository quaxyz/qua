import React from "react";
import { GetServerSideProps } from "next";
import Script from "next/script";
import Link from "components/link";
import CustomerLayout from "components/layouts/customer-dashboard";
import prisma from "libs/prisma";
import Api from "libs/api";
import { providers } from "ethers";
import { useRouter } from "next/router";
import { useCartStore } from "hooks/useCart";
import { useWeb3React } from "@web3-react/core";
import { useMutation, useQuery } from "react-query";
import {
  Button,
  chakra,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CostSummary } from "components/cost-summary";
import { getAddressFromCookie } from "libs/cookie";
import { mapSocialLink } from "libs/utils";
import { domain, schemas } from "libs/constants";

function pay({ name, email, amount }: any) {
  return new Promise((resolve, reject) => {
    (global as any).LazerCheckout({
      name,
      email,
      amount,
      key: process.env.NEXT_PUBLIC_LAZER_PAY_KEY,
      currency: "USD",
      onClose: (data: any) => {
        console.log("onclose", data);
        reject(new Error("Payment cancelled"));
      },
      onSuccess: (data: any) => {
        resolve(data);
      },
      onError: (data: any) => {
        console.log("Error", data);
        reject(new Error("Payment error"));
      },
    });
  });
}

function usePlaceOrder() {
  const { library, account } = useWeb3React();
  const toast = useToast();
  const router = useRouter();
  const cartStore = useCartStore();

  const items = cartStore?.items.map((c) => c.productId);
  const cartDetailsQueryResp = useQuery({
    queryKey: ["cartItemsDetails", items],
    onError: () => console.warn("Error fetching cart details from API"),
    enabled: (items?.length || 0) > 0,
    queryFn: async () => {
      const { payload } = await Api().post(`/cart/details`, {
        cart: items,
      });

      return payload;
    },
    select: (data) =>
      data.map((product: any) => {
        const cartItem = cartStore?.items.find(
          (item) => product.id === item.productId
        );
        return {
          productId: product.id,
          quantity: cartItem?.quantity,
          name: product.name,
          price: product.price,
        };
      }),
  });

  const createOrderMutation = useMutation(async (payload: any) => {
    return Api().post("/order", payload);
  });

  return async ({ shipping, paymentMethod }: any) => {
    if (!library || !account) {
      console.error("Library or account is not ready", {
        library,
        account,
      });

      toast({
        title: "Error creating order",
        description: "Please connect your wallet",
        position: "bottom-right",
        status: "error",
      });

      return null;
    }

    let provider: providers.Web3Provider = library;
    const signer = provider.getSigner(account);

    // format message into schema
    const message = {
      from: account,
      timestamp: parseInt((Date.now() / 1000).toFixed()),
      store: router.query.store,
      cart: JSON.stringify(cartDetailsQueryResp?.data || []),
      shipping: JSON.stringify(shipping || {}),
      paymentMethod,
    };

    const data = {
      domain,
      types: { Order: schemas.Order },
      message,
    };

    try {
      const sig = await signer._signTypedData(
        data.domain,
        data.types,
        data.message
      );
      console.log("Sign", { address: account, sig, data });

      const { payload: result } = await createOrderMutation.mutateAsync({
        address: account,
        sig,
        data,
      });
      console.log("Result", result);

      return result;
    } catch (err: any) {
      console.warn("Error creating order", err);

      toast({
        title: "Error creating order",
        description: err.message,
        position: "bottom-right",
        status: "error",
      });

      throw err;
    }
  };
}

function useHandlePayment() {
  const toast = useToast();

  const confirmPaymentMutation = useMutation(async (payload: any) => {
    return Api().post("/confirm-payment", payload);
  });

  return async ({ orderHash, shippingDetails, amount }: any) => {
    try {
      const payload = await pay({
        name: shippingDetails?.name,
        email: shippingDetails?.email,
        amount: `${amount}`,
      });

      await confirmPaymentMutation.mutateAsync({
        orderHash,
        paymentPayload: payload,
      });
    } catch (err: any) {
      toast({
        title: "Error during payment",
        description: err?.message,
        position: "bottom-right",
        status: "warning",
      });
    }
  };
}

const Page = ({ shippingDetails: userShippingDetails, storeDetails }: any) => {
  const router = useRouter();
  const cartStore = useCartStore();
  const placeOrder = usePlaceOrder();
  const handlePayment = useHandlePayment();

  const [shippingDetails, setShippingDetails] =
    React.useState(userShippingDetails);
  const [paymentMethod, setPaymentMethod] = React.useState("CRYPTO");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (!userShippingDetails) {
      const localShippingDetails = localStorage.getItem("shippingDetails");

      if (!localShippingDetails) {
        router.push({
          pathname: "/[store]/shipping",
          query: { store: router.query.store },
        });

        return;
      }

      setShippingDetails(JSON.parse(localShippingDetails));
    }
  }, [router, userShippingDetails]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);

    try {
      // sign and create order
      const orderResult = await placeOrder({
        shipping: shippingDetails,
        paymentMethod,
      });

      if (paymentMethod === "CRYPTO") {
        // handle payment
        await handlePayment({
          shippingDetails,
          orderHash: orderResult?.hash,
          amount: orderResult?.totalAmount,
        });
      }

      // clear shipping details in local storage
      localStorage.removeItem("shippingDetails");

      // clear cart
      await cartStore?.clearCart();

      // redirect to order page
      router.push({
        pathname: "/[store]/orders/[orderId]",
        query: { store: router.query.store, orderId: orderResult?.hash },
      });
    } catch (e) {
    } finally {
      setSending(false);
    }
  };

  const costSummary = {
    subtotal: cartStore?.subTotal || 0,
    "Delivery fee":
      shippingDetails?.deliveryMethod === "PICKUP"
        ? 0
        : storeDetails?.deliveryFee || 0,
    "Network Fee":
      paymentMethod === "CRYPTO" ? (cartStore?.subTotal || 0) * 0.01 : 0,
  };

  return (
    <chakra.main>
      <Container
        maxW={{ base: "100%", md: "container.lg" }}
        pb={20}
        borderLeft="0.5px solid rgba(0, 0, 0, 8%)"
        borderRight="0.5px solid rgba(0, 0, 0, 8%)"
        centerContent
      >
        <Stack w="100%" px={{ base: "2", md: "24" }}>
          <Stack spacing="4">
            <chakra.header pt={{ base: "8", md: "16" }}>
              <Stack direction="row" justify="space-between">
                <Heading
                  as="h2"
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Shipping Details
                </Heading>

                <Link href="/shipping">Change</Link>
              </Stack>
            </chakra.header>

            <Stack
              spacing={2}
              py={{ base: "4", md: "6" }}
              borderTop="0.5px solid rgba(0, 0, 0, 8%)"
              borderBottom="0.5px solid rgba(0, 0, 0, 8%)"
            >
              <Heading as="h4" size="md">
                {shippingDetails?.name}
              </Heading>
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {shippingDetails?.address}
              </Text>
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {shippingDetails?.phone}
              </Text>
            </Stack>
          </Stack>

          <Stack spacing="4">
            <chakra.header pt={{ base: "8", md: "8" }}>
              <Stack direction="row" justify="space-between">
                <Heading
                  as="h2"
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Delivery Method
                </Heading>

                <Link href="/shipping">Change</Link>
              </Stack>
            </chakra.header>

            <Stack
              spacing={2}
              py={{ base: "4", md: "4" }}
              borderTop="0.5px solid rgba(0, 0, 0, 8%)"
              borderBottom="0.5px solid rgba(0, 0, 0, 8%)"
            >
              <Text color="#000" opacity="0.72" mt={{ base: "1", md: "2" }}>
                {
                  (
                    {
                      PICKUP: "Contact seller for pickup",
                      DOOR_DELIVERY: "Door delivery",
                    } as any
                  )[shippingDetails?.deliveryMethod]
                }
              </Text>

              {shippingDetails?.deliveryMethod === "PICKUP" && (
                <Stack direction="row" spacing={3} py={3} px={2}>
                  {Object.entries(storeDetails.socialLinks || {})
                    .filter(([_, value]: any) => value.length)
                    .map(([social, link]: any) => (
                      <Link
                        key={social}
                        href={mapSocialLink(social, link)}
                        textTransform="capitalize"
                        isExternal
                      >
                        {social}
                      </Link>
                    ))}
                </Stack>
              )}
            </Stack>
          </Stack>

          <Stack as="form" spacing={{ base: 4, md: 8 }} onSubmit={onSubmit}>
            <Stack py="4" spacing={6}>
              <Heading
                as="h2"
                fontSize={{ base: "lg", md: "1xl" }}
                color="#000"
              >
                Payment Method
              </Heading>

              <RadioGroup
                name="Payment Method"
                onChange={(value) => setPaymentMethod(value)}
                value={paymentMethod}
              >
                <Stack spacing={4}>
                  <Radio size="md" value="CRYPTO">
                    Pay now with Crypto (Recomended){"\n"}
                    <Text fontSize="xs">
                      Paying with crypto makes you eligible for future rewards
                    </Text>
                  </Radio>
                  <Radio size="md" value="CONTACT_SELLER">
                    Contact seller for payment option
                  </Radio>
                </Stack>
              </RadioGroup>

              {paymentMethod === "CONTACT_SELLER" && (
                <Stack
                  direction="row"
                  spacing={3}
                  py={3}
                  px={2}
                  border="1px solid rgb(0 0 0 / 12%)"
                  borderLeft="none"
                  borderRight="none"
                >
                  {Object.entries(storeDetails.socialLinks || {})
                    .filter(([_, value]: any) => value.length)
                    .map(([social, link]: any) => (
                      <Link
                        key={social}
                        href={mapSocialLink(social, link)}
                        textTransform="capitalize"
                        isExternal
                      >
                        {social}
                      </Link>
                    ))}
                </Stack>
              )}
            </Stack>

            <CostSummary data={costSummary} />

            <Button
              type="submit"
              size="lg"
              variant="solid"
              width="100%"
              isLoading={sending}
            >
              Place my Order
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* load lazerPay script */}
      <Script src="https://cdn.jsdelivr.net/gh/LazerPay-Finance/checkout-build@main/checkout%401.0.1/dist/index.min.js" />
    </chakra.main>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = ctx.params?.store as string;
  const address = getAddressFromCookie(true, ctx);

  const props: any = {
    layoutProps: {
      title: "Payment",
    },
  };

  if (!address) {
    return { props };
  }

  const user = await prisma.user.findUnique({
    where: { address },
    select: { shippingDetails: true },
  });
  props.shippingDetails = user?.shippingDetails;

  const storeDetails = await prisma.store.findUnique({
    where: { name: store },
    select: { deliveryFee: true, socialLinks: true },
  });
  props.storeDetails = storeDetails;

  return { props };
};

Page.Layout = CustomerLayout;
export default Page;
