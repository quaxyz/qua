import React from "react";
import prisma from "libs/prisma";
import Api from "libs/api";
import type { GetServerSideProps } from "next";
import { getAddressFromCookie } from "libs/cookie";
import CustomerLayout from "components/layouts/customer-dashboard";
import {
  Button,
  chakra,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { useMutation } from "react-query";
import { useCartStore } from "hooks/useCart";
import { mapSocialLink } from "libs/utils";
import { CostSummary } from "components/cost-summary";
import { domain, schemas } from "libs/constants";
import { providers } from "ethers";

const useSaveDetails = () => {
  const router = useRouter();
  const { library, account } = useWeb3React();

  const updateDetailsMutation = useMutation(async (payload: any) => {
    if (!library || !account) {
      throw new Error("Please connect your wallet");
    }

    let provider: providers.Web3Provider = library;
    const signer = provider.getSigner(account);

    // format message into schema
    const message = {
      from: account,
      timestamp: parseInt((Date.now() / 1000).toFixed()),
      store: router.query.store,
      details: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        deliveryMethod: payload.deliveryMethod,
      }),
    };

    const data = {
      domain,
      types: { AccountDetails: schemas.AccountDetails },
      message,
    };

    const sig = await signer._signTypedData(
      data.domain,
      data.types,
      data.message
    );
    console.log("Sign", { address: account, sig, data });

    return Api().post(`/account`, {
      address: account,
      sig,
      data,
    });
  });

  return updateDetailsMutation;
};

const Page = ({ shippingDetails, storeDetails }: any) => {
  const toast = useToast();
  const router = useRouter();
  const cartStore = useCartStore();
  const updateDetailsMutation = useSaveDetails();

  const [saveDetails, setSaveDetails] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<any>({});
  const [formValue, setFormValue] = React.useState({
    name: shippingDetails?.name || "",
    email: shippingDetails?.email || "",
    phone: shippingDetails?.phone || "",
    address: shippingDetails?.address || "",
    deliveryMethod: shippingDetails?.deliveryMethod || "DOOR_DELIVERY",
  });

  const checkForErrors = (state: any) => ({
    name: !state.name || state.name.length < 1,
    email: !state.name || state.name.length < 1,
    phone: !state.name || state.name.length < 1,
    address: !state.name || state.name.length < 1,
  });

  const onSave = async (e: any) => {
    e.preventDefault();

    try {
      // verify input
      const formErrors: any = checkForErrors(formValue);
      const formHasError = Object.keys(formErrors).filter(
        (field) => formErrors[field]
      ).length;

      if (formHasError) {
        setErrors({ ...formErrors });
        return;
      }

      setSaving(true);

      if (saveDetails) {
        // send data to server
        await updateDetailsMutation.mutateAsync(formValue);
      } else {
        // store data in localstorage
        localStorage.setItem("shippingDetails", JSON.stringify(formValue));
      }

      return router.push({
        pathname: "/[store]/payment",
        query: { store: router.query.store },
      });
    } catch (error: any) {
      toast({
        title: "Error saving details",
        description: error.message,
        position: "bottom-right",
        status: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const costSummary = {
    subtotal: cartStore?.subTotal || 0,
    "Delivery fee":
      formValue.deliveryMethod === "PICKUP"
        ? 0
        : storeDetails?.deliveryFee || 0,
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
        <Stack
          w="100%"
          px={{ base: "2", md: "24" }}
          overflowY="scroll"
          pb={{ base: "12", md: "0" }}
        >
          <chakra.form onSubmit={(e) => onSave(e)}>
            <chakra.header pt={{ base: "8", md: "16" }}>
              <Heading
                as="h2"
                fontSize={{ base: "lg", md: "1xl" }}
                color="#000"
              >
                Shipping Details
              </Heading>
            </chakra.header>
            <Stack py={12} spacing={12}>
              <FormControl id="name" isInvalid={errors.name} isRequired>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <Input
                  type="text"
                  placeholder="James Bond"
                  variant="flushed"
                  disabled={saving}
                  value={formValue.name}
                  onChange={(e) =>
                    setFormValue({ ...formValue, name: e.target.value })
                  }
                />
                <FormErrorMessage>Name is required</FormErrorMessage>
              </FormControl>

              <FormControl id="email" isInvalid={errors.email} isRequired>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="james007@emails.com"
                  variant="flushed"
                  disabled={saving}
                  value={formValue.email}
                  onChange={(e) =>
                    setFormValue({ ...formValue, email: e.target.value })
                  }
                />
                <FormErrorMessage>Email is required</FormErrorMessage>
              </FormControl>

              <FormControl id="phone" isInvalid={errors.phone} isRequired>
                <FormLabel htmlFor="phone">Phone number</FormLabel>
                <Input
                  type="tel"
                  placeholder="888 888 8888"
                  variant="flushed"
                  disabled={saving}
                  value={formValue.phone}
                  onChange={(e) =>
                    setFormValue({ ...formValue, phone: e.target.value })
                  }
                />
                <FormErrorMessage>Phone is required</FormErrorMessage>
              </FormControl>

              <FormControl id="address" isInvalid={errors.address} isRequired>
                <FormLabel htmlFor="address">Address</FormLabel>
                <Input
                  type="text"
                  placeholder="Address"
                  variant="flushed"
                  disabled={saving}
                  value={formValue.address}
                  onChange={(e) =>
                    setFormValue({ ...formValue, address: e.target.value })
                  }
                />
                <FormErrorMessage>Address is required</FormErrorMessage>
              </FormControl>

              <Checkbox
                size="lg"
                mb={6}
                isChecked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
              >
                Save details for next time
              </Checkbox>

              <Stack spacing={6}>
                <Heading
                  as="h2"
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Delivery Method
                </Heading>

                <RadioGroup
                  name="Delivery Method"
                  onChange={(value) =>
                    setFormValue({ ...formValue, deliveryMethod: value })
                  }
                  value={formValue.deliveryMethod}
                >
                  <Stack>
                    <Radio size="md" value="DOOR_DELIVERY">
                      Door Delivery
                    </Radio>
                    <Radio size="md" value="PICKUP">
                      Contact seller for pickup
                    </Radio>
                  </Stack>
                </RadioGroup>

                {formValue.deliveryMethod === "PICKUP" && (
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
                isLoading={saving}
              >
                Proceed to Payment
              </Button>
            </Stack>
          </chakra.form>
        </Stack>
      </Container>
    </chakra.main>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = ctx.params?.store as string;
  const address = getAddressFromCookie(true, ctx);

  const storeDetails = await prisma.store.findUnique({
    where: { name: store },
    select: { deliveryFee: true, socialLinks: true },
  });

  if (!storeDetails) {
    return { notFound: true };
  }

  const props: any = {
    storeDetails: JSON.parse(JSON.stringify(storeDetails)),
    layoutProps: {
      title: "Shipping",
    },
  };

  if (!address) {
    return { props };
  }

  const user = await prisma.user.findUnique({
    where: { address },
    select: { shippingDetails: true },
  });

  props.shippingDetails = JSON.parse(JSON.stringify(user?.shippingDetails));

  return { props };
};

Page.Layout = CustomerLayout;
export default Page;
