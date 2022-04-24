import React from "react";
import { GetServerSideProps } from "next";
import prisma from "libs/prisma";
import Api from "libs/api";
import Link from "components/link";
import CustomerLayout from "components/layouts/customer";
import {
  useToast,
  chakra,
  Container,
  Stack,
  Heading,
  RadioGroup,
  Radio,
  Button,
  Text,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { CostSummary } from "components/cost-summary";
import { useCartStore } from "hooks/useCart";
import { mapSocialLink } from "libs/utils";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

const Page = ({ order, store }: any) => {
  const toast = useToast();
  const router = useRouter();
  const cart = useCartStore();

  React.useEffect(() => {
    if (order.paymentStatus.toLowerCase() === "unpaid" && router.query.id) {
      // if paymentStatus is unpaid set order to be pending so user change order details
      localStorage.setItem("unfinishedOrder", router.query.id as string);
    }
  }, [order, router]);

  const saveOrderDetails = useMutation(
    async (data: any) => {
      return Api().post(
        `/${router.query.store}/orders/${router.query.id}/payment`,
        data
      );
    },
    {
      onSuccess: ({ payload }: any) => {
        // clear shipping details in local storage
        localStorage.removeItem("unfinishedOrder");

        // clear cart
        cart?.clearCart();

        // redirect to order page
        router.push(`/orders/${payload.id}`);
      },
      onError: (err: any) => {
        toast({
          title: "Error saving order",
          description: err?.message,
          position: "bottom-right",
          status: "error",
          isClosable: true,
        });
      },
    }
  );

  const [paymentMethod, setPaymentMethod] = React.useState(
    order.paymentMethod || "BANK_TRANSFER"
  );
  const [customerDetails, setCustomerDetails] = React.useState({
    name: order.customerDetails?.name || "",
    address: order.customerDetails?.address || "",
    email: order.customerDetails?.email || "",
    phone: order.customerDetails?.phone || "",
    deliveryMethod: order.customerDetails?.deliveryMethod || "DOOR_DELIVERY",
  });
  const [errors, setErrors] = React.useState<any>({});

  const validateCustomerDetails = (state: any) => ({
    name: !state.name || state.name.length < 1,
    address: !state.address || state.address.length < 1,
    email: !state.email || state.email.length < 1,
    phone: !state.phone || state.phone.length < 1,
  });

  const onSubmit = async () => {
    if (saveOrderDetails.isLoading) return;

    // verify input
    const formErrors: any = validateCustomerDetails(customerDetails);

    const formHasError = Object.keys(formErrors).filter(
      (field) => formErrors[field]
    ).length;

    if (formHasError) {
      setErrors({ ...formErrors });
      return;
    }

    await saveOrderDetails.mutateAsync({
      customerDetails,
      paymentMethod,
    });

    // clear shipping details in local storage
    localStorage.removeItem("shippingDetails");
  };

  const costSummary = {
    subtotal: order.subtotal,
    "Delivery fee":
      customerDetails?.deliveryMethod === "DOOR_DELIVERY"
        ? store.deliveryFee || 0
        : 0,
  };

  return (
    <Container maxW="100%" px={{ base: "4", md: "24" }} mb={16}>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 6, md: 12 }}
      >
        <chakra.div
          flex={2}
          px={{ base: "0", md: "16" }}
          pb={{ base: "0", md: "16" }}
          m={{ base: "0", md: "12" }}
          border="0.5px solid rgba(0, 0, 0, 12%)"
        >
          <Stack spacing="4">
            <chakra.header pt={{ base: "8", md: "16" }}>
              <Stack direction="row" justify="space-between">
                <Heading
                  as="h2"
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Your Details
                </Heading>
              </Stack>
            </chakra.header>

            <Stack
              spacing={4}
              py={{ base: "4", md: "6" }}
              borderTop="0.5px solid rgba(0, 0, 0, 8%)"
              borderBottom="0.5px solid rgba(0, 0, 0, 8%)"
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={8}
                pb={6}
              >
                <FormControl id="name" isRequired isInvalid={errors.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    variant="flushed"
                    isRequired
                    isDisabled={order.status !== "UNFULFILLED"}
                    value={customerDetails.name}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        name: e.target.value,
                      })
                    }
                  />
                  <FormErrorMessage>Name is required</FormErrorMessage>
                </FormControl>

                <FormControl id="email" isRequired isInvalid={errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="name@email.com"
                    variant="flushed"
                    isRequired
                    isDisabled={order.status !== "UNFULFILLED"}
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        email: e.target.value,
                      })
                    }
                  />
                  <FormErrorMessage>Email is required</FormErrorMessage>
                </FormControl>
              </Stack>

              <Stack direction={{ base: "column", md: "row" }} spacing="8">
                <FormControl id="phone" isRequired isInvalid={errors.phone}>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <Input
                    type="tel"
                    placeholder="0123456789"
                    variant="flushed"
                    isRequired
                    isDisabled={order.status !== "UNFULFILLED"}
                    value={customerDetails.phone}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        phone: e.target.value,
                      })
                    }
                  />
                  <FormErrorMessage>Phone is required</FormErrorMessage>
                </FormControl>

                <FormControl id="address" isRequired isInvalid={errors.address}>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter address"
                    variant="flushed"
                    isRequired
                    isDisabled={order.status !== "UNFULFILLED"}
                    value={customerDetails.address}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        address: e.target.value,
                      })
                    }
                  />
                  <FormErrorMessage>Address is required</FormErrorMessage>
                </FormControl>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing="4">
            <chakra.header pt={{ base: "8", md: "8" }}>
              <Stack direction="row" justify="space-between">
                <Heading
                  as="h3"
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Delivery Method
                </Heading>
              </Stack>
            </chakra.header>

            <Stack
              spacing={2}
              py={{ base: "4", md: "4" }}
              borderTop="0.5px solid rgba(0, 0, 0, 8%)"
              borderBottom="0.5px solid rgba(0, 0, 0, 8%)"
            >
              <RadioGroup
                name="Delivery Method"
                onChange={(value) =>
                  setCustomerDetails({
                    ...customerDetails,
                    deliveryMethod: value,
                  })
                }
                value={customerDetails.deliveryMethod}
              >
                <Stack direction="row" spacing={8}>
                  <Radio
                    size="md"
                    value="DOOR_DELIVERY"
                    isDisabled={
                      order.status !== "UNFULFILLED" ||
                      order.paymentStatus === "PAID"
                    }
                  >
                    Home Delivery
                  </Radio>
                  <Radio
                    size="md"
                    value="PICKUP"
                    isDisabled={
                      order.status !== "UNFULFILLED" ||
                      order.paymentStatus === "PAID"
                    }
                  >
                    Pickup
                  </Radio>
                </Stack>
              </RadioGroup>

              {customerDetails.deliveryMethod === "PICKUP" && (
                <Stack direction="row" spacing={3} py={3}>
                  <Text fontSize="sm" color="rgb(0 0 0 / 70%)">
                    Pickup At: {store.location ?? "Store Location"}
                  </Text>
                </Stack>
              )}
            </Stack>
          </Stack>

          <Stack py="4" spacing={6}>
            <Heading as="h3" fontSize={{ base: "lg", md: "1xl" }} color="#000">
              Payment Method
            </Heading>

            <RadioGroup
              name="Payment Method"
              onChange={(value) => setPaymentMethod(value)}
              value={paymentMethod}
            >
              <Stack spacing={4}>
                <Radio
                  size="md"
                  value="BANK_TRANSFER"
                  isDisabled={
                    order.status !== "UNFULFILLED" ||
                    order.paymentStatus === "PAID"
                  }
                >
                  <Text fontSize="sm">Pay with Bank Transfer</Text>
                </Radio>
                <Radio
                  size="md"
                  value="CASH"
                  isDisabled={
                    order.status !== "UNFULFILLED" ||
                    order.paymentStatus === "PAID"
                  }
                >
                  <Text fontSize="sm">Pay With Cash</Text>
                </Radio>
                <Radio
                  size="md"
                  value="CONTACT_SELLER"
                  isDisabled={
                    order.status !== "UNFULFILLED" ||
                    order.paymentStatus === "PAID"
                  }
                >
                  <Text fontSize="sm">
                    Contact seller for more payment option
                  </Text>
                </Radio>
              </Stack>
            </RadioGroup>

            {paymentMethod === "BANK_TRANSFER" && store.bankDetails && (
              <Stack
                direction="row"
                spacing={3}
                py={3}
                px={2}
                border="1px solid rgb(0 0 0 / 12%)"
                borderLeft="none"
                borderRight="none"
              >
                <Text
                  fontSize="sm"
                  color="rgb(0 0 0 / 70%)"
                  textTransform="capitalize"
                >
                  Bank Name:{" "}
                  <chakra.span fontWeight="bold">
                    {store.bankDetails.name}
                  </chakra.span>
                </Text>
                <Text
                  fontSize="sm"
                  color="rgb(0 0 0 / 70%)"
                  textTransform="capitalize"
                >
                  Account Name:{" "}
                  <chakra.span fontWeight="bold">
                    {store.bankDetails.accountName}
                  </chakra.span>
                </Text>
                <Text
                  fontSize="sm"
                  color="rgb(0 0 0 / 70%)"
                  textTransform="capitalize"
                >
                  Account Name:{" "}
                  <chakra.span fontWeight="bold">
                    {store.bankDetails.accountNumber}
                  </chakra.span>
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
                {Object.entries(store.socialLinks || {})
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
                  fontSize="sm"
                  color="rgb(0 0 0 70%)"
                  href={`mailto:${store.email}`}
                  textTransform="capitalize"
                  isExternal
                >
                  email
                </Link>
              </Stack>
            )}
          </Stack>
        </chakra.div>

        <chakra.div flex={1} pt={{ md: 12 }}>
          <Stack
            p={{ base: "4", md: "8" }}
            my={4}
            border="0.5px solid rgba(0, 0, 0, 12%)"
            spacing={{ base: 4, md: 8 }}
          >
            <CostSummary data={costSummary} currency={store.currency} />

            <Button
              size="lg"
              variant="solid"
              width="100%"
              isDisabled={
                order.status !== "UNFULFILLED" || order.paymentStatus === "PAID"
              }
              isLoading={saveOrderDetails.isLoading}
              onClick={onSubmit}
            >
              Complete Order
            </Button>
          </Stack>
        </chakra.div>
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.store || !params?.id) {
    return {
      notFound: true,
    };
  }

  const store = await prisma.store.findUnique({
    where: {
      name: params.store as string,
    },
    select: {
      name: true,
      location: true,
      deliveryFee: true,
      socialLinks: true,
      email: true,
      owner: true,
      bankDetails: true,
      currency: true,
    },
  });
  if (!store) {
    return {
      notFound: true,
    };
  }

  const order = await prisma.order.findFirst({
    where: {
      publicId: params.id as string,
      store: {
        name: store.name,
      },
    },
    select: {
      publicId: true,
      items: true,
      subtotal: true,
      status: true,
      paymentStatus: true,
      customerDetails: true,
      paymentMethod: true,
      pricingBreakdown: true,
    },
  });
  if (!order) {
    return {
      notFound: true,
    };
  }

  // TODO: HACK: We hide the order email if the data is already filled

  return {
    props: {
      store: JSON.parse(JSON.stringify(store)),
      order: JSON.parse(JSON.stringify(order)),
      layoutProps: {
        title: `Payment - ${store.name}`,
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
