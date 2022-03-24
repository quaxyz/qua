import React from "react";
import Script from "next/script";
import Api from "libs/api";
import prisma from "libs/prisma";
import CustomerLayout from "components/layouts/customer-dashboard";
import Link from "components/link";
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
import { useCartStore } from "hooks/useCart";
import { mapSocialLink } from "libs/utils";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FcCheckmark } from "react-icons/fc";
import { useMutation } from "react-query";
import { getLayoutProps } from "components/layouts/customer-props";
import { withSsrSession } from "libs/session";

function pay({ name, email, amount }: any) {
  return new Promise((resolve, reject) => {
    let paymentPayload: any;

    (global as any).LazerCheckout({
      name,
      email,
      amount,
      key: process.env.NEXT_PUBLIC_LAZER_PAY_KEY,
      currency: "USD",
      onClose: (data: any) => {
        // HACK: since the checkbox doesn't close automatically we have to react to it being closed before we
        // do anything
        resolve(paymentPayload);
      },
      onSuccess: (data: any) => {
        paymentPayload = data;
      },
      onError: (data: any) => {
        console.log("Error", data);
        reject(new Error("Payment error"));
      },
    });
  });
}

function useHandlePayment() {
  const toast = useToast();

  const confirmPaymentMutation = useMutation(async (payload: any) => {
    return Api().post("/payment/confirm", payload);
  });

  return async ({ orderId, shippingDetails, amount }: any) => {
    try {
      const payload: any = await pay({
        name: shippingDetails?.name,
        email: shippingDetails?.email,
        amount: `${amount}`,
      });
      if (!payload) throw Error("payment modal closed before confirmation");

      await confirmPaymentMutation.mutateAsync({
        orderId,
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
  const toast = useToast();
  const router = useRouter();
  const cartStore = useCartStore();
  const handlePayment = useHandlePayment();
  const placeOrder = useMutation(
    async (data: any) => {
      const { payload } = await Api().post("/orders/create", data);
      return payload;
    },
    {
      onError: (err: any) => {
        toast({
          title: "Error placing order",
          description: err?.message,
          position: "bottom-right",
          status: "error",
          isClosable: true,
        });
      },
    }
  );

  const [shippingDetails, setShippingDetails] =
    React.useState(userShippingDetails);
  const [paymentMethod, setPaymentMethod] = React.useState("CRYPTO");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (!userShippingDetails) {
      const localShippingDetails = localStorage.getItem("shippingDetails");

      if (!localShippingDetails) {
        router.push({
          pathname: "/shipping",
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
      const orderResult = await placeOrder.mutateAsync({
        shipping: shippingDetails,
        paymentMethod,
      });

      if (paymentMethod === "CRYPTO") {
        // handle payment
        await handlePayment({
          shippingDetails,
          orderId: orderResult?.id,
          amount: orderResult?.totalAmount,
        });
      }

      // clear shipping details in local storage
      localStorage.removeItem("shippingDetails");

      // clear cart
      await cartStore?.clearCart();

      // redirect to order page
      router.push({
        pathname: "/orders/[id]",
        query: { id: orderResult?.id },
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
                <Stack direction="row" align="center">
                  <FcCheckmark fontSize="24px" />
                  <Heading
                    as="h2"
                    fontSize={{ base: "lg", md: "1xl" }}
                    color="#000"
                  >
                    Shipping Details
                  </Heading>
                </Stack>

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
                <Stack direction="row" align="center">
                  <FcCheckmark fontSize="24px" />
                  <Heading
                    as="h2"
                    fontSize={{ base: "lg", md: "1xl" }}
                    color="#000"
                  >
                    Delivery Method
                  </Heading>
                </Stack>

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

                  <Link
                    href={`mailto:${storeDetails.email}`}
                    textTransform="capitalize"
                    isExternal
                  >
                    email
                  </Link>
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
                      Pay with crypto makes you eligible for platform rewards.
                    </Text>
                  </Radio>
                  <Radio size="md" value="BANK_TRANSFER">
                    Pay with Bank Transfer
                  </Radio>
                  <Radio size="md" value="CASH">
                    Pay With Cash
                  </Radio>
                  <Radio size="md" value="CONTACT_SELLER">
                    Contact seller for more payment option
                  </Radio>
                </Stack>
              </RadioGroup>

              {paymentMethod === "BANK_TRANSFER" && (
                <Stack
                  direction="row"
                  spacing={3}
                  py={3}
                  px={2}
                  border="1px solid rgb(0 0 0 / 12%)"
                  borderLeft="none"
                  borderRight="none"
                >
                  <Text textTransform="capitalize" isExternal>
                    Bank Name: {storeDetails.bankDetails?.name}
                  </Text>
                  <Text textTransform="capitalize" isExternal>
                    Account Name: {storeDetails.bankDetails?.accountName}
                  </Text>
                  <Text textTransform="capitalize" isExternal>
                    Account Name: {storeDetails.bankDetails?.accountNumber}
                  </Text>
                </Stack>
              )}

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

                  <Link
                    href={`mailto:${storeDetails.email}`}
                    textTransform="capitalize"
                    isExternal
                  >
                    email
                  </Link>
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

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (ctx: any) => {
    const store = ctx?.params?.store as string;
    let layoutProps = await getLayoutProps(ctx);
    if (!layoutProps) return { notFound: true };

    if (!layoutProps.cart?.items.length) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const storeDetails = await prisma.store.findUnique({
      where: { name: store },
      select: {
        deliveryFee: true,
        socialLinks: true,
        email: true,
        owner: true,
        bankDetails: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: ctx?.req.session.data?.userId },
      select: { shippingDetails: true },
    });

    return {
      props: {
        shippingDetails: JSON.parse(JSON.stringify(user?.shippingDetails)),
        storeDetails: JSON.parse(JSON.stringify(storeDetails)),
        layoutProps: {
          ...layoutProps,
          title: "Payment",
        },
      },
    };
  }
);

Page.Layout = CustomerLayout;
export default Page;
