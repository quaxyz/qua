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
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useMutation } from "react-query";
import { useCartStore } from "hooks/useCart";

const Page = ({ shippingDetails }: any) => {
  const toast = useToast();
  const cartStore = useCartStore();
  const { account } = useWeb3React();

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

  const updateShippingMutation = useMutation(async (payload: any) => {
    return Api().post(`/shipping?address=${account}`, payload);
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

      // send data to server
      await updateShippingMutation.mutateAsync({
        shippingDetails: formValue,
        saveDetails,
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

              <FormControl id="phone" isInvalid={errors.email} isRequired>
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

              <FormControl id="address" isInvalid={errors.email} isRequired>
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

              <Stack pb="">
                <Heading
                  as="h2"
                  py={{ base: "4", md: "4" }}
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Delivery Method
                </Heading>

                <RadioGroup
                  onChange={(value) =>
                    setFormValue({ ...formValue, deliveryMethod: value })
                  }
                  value={formValue.deliveryMethod}
                >
                  <Stack spacing={{ base: "4", md: "6" }}>
                    <Radio size="lg" value="DOOR_DELIVERY">
                      Door Delivery
                    </Radio>
                    <Radio size="lg" value="PICKUP">
                      Contact seller for pickup
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>

              <Stack direction="row" justify="space-between" py={2}>
                <Stack direction="column" spacing={4}>
                  <Text>Subtotal</Text>
                  <Text>Network Fee</Text>
                  <Text>Total</Text>
                </Stack>
                <Stack direction="column" spacing={4}>
                  <Text>:</Text>
                  <Text>:</Text>
                  <Text>:</Text>
                </Stack>
                <Stack direction="column" fontWeight="bold" spacing={4}>
                  <Text>${cartStore?.subTotal || 0}</Text>
                  <Text>$1</Text>
                  <Text>${(cartStore?.subTotal || 0) + 1}</Text>
                </Stack>
              </Stack>

              <Button type="submit" size="lg" variant="solid" width="100%">
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
  const address = getAddressFromCookie(true, ctx);
  const props: any = {
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
  props.shippingDetails = user?.shippingDetails;

  //

  // todo:: fetch store delivery fee

  return { props };
};

Page.Layout = CustomerLayout;
export default Page;
