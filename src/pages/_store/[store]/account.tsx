import React from "react";
import { GetServerSideProps } from "next";
import prisma from "libs/prisma";
import Api from "libs/api";
import {
  Box,
  Button,
  chakra,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import CustomerLayout from "components/layouts/customer-dashboard";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { useMutation } from "react-query";
import { truncateAddress } from "libs/utils";
import { providers } from "ethers";
import { domain, schemas } from "libs/constants";
import { getLayoutProps } from "components/layouts/props";

const useSaveDetails = () => {
  const router = useRouter();
  const toast = useToast();
  const { library, account } = useWeb3React();

  const updateDetailsMutation = useMutation(
    async (payload: any) => {
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
    },
    {
      onSuccess: ({ payload: result }) => {
        console.log("Result", result);

        toast({
          title: "Success",
          description: "Account details updated",
          position: "top-right",
          status: "success",
        });
      },
      onError: (err: any) => {
        console.warn("Error saving details", err);

        toast({
          title: "Error saving details",
          description: err.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return updateDetailsMutation;
};

const Page = ({ accountDetails }: any) => {
  const { account } = useWeb3React();
  const updateDetailsMutation = useSaveDetails();

  const [errors, setErrors] = React.useState<any>({});
  const [formValue, setFormValue] = React.useState({
    name: accountDetails?.name || "",
    email: accountDetails?.email || "",
    phone: accountDetails?.phone || "",
    address: accountDetails?.address || "",
  });

  const checkForErrors = (state: any) => ({
    name: !state.name || state.name.length < 1,
    email: !state.name || state.name.length < 1,
    phone: !state.name || state.name.length < 1,
    address: !state.name || state.name.length < 1,
  });

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // verify input
    const formErrors: any = checkForErrors(formValue);
    const formHasError = Object.keys(formErrors).filter(
      (field) => formErrors[field]
    ).length;

    if (formHasError) {
      setErrors({ ...formErrors });
      return;
    }

    // send data to server
    await updateDetailsMutation.mutateAsync(formValue);
  };

  return (
    <Container
      maxW={{ base: "100%", md: "container.xl" }}
      px={{ base: "4", md: "16" }}
      py={{ base: "4", md: "16" }}
    >
      <Text mb={3}>Welcome,</Text>

      {account ? (
        <Stack
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
        >
          <Heading as="h3" color="#000" fontSize={{ base: "2xl", md: "4xl" }}>
            {formValue.name || "Internet stranger"}
          </Heading>

          <Box
            cursor="pointer"
            bg=" rgba(0, 0, 0, 0.04)"
            rounded="50px"
            height="100%"
            px="0.8rem"
            py="0.4rem"
            display="inline-block"
            userSelect="none"
            textAlign="center"
          >
            <Text fontSize={{ base: "sm", md: "md" }}>
              {truncateAddress(account || "", 6)}
            </Text>
          </Box>
        </Stack>
      ) : (
        <Stack
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
        >
          <Heading as="h6" color="#000" fontSize={{ base: "xl", md: "2xl" }}>
            Please connect your account
          </Heading>
        </Stack>
      )}

      <Spacer
        my={{ base: "4", md: "12" }}
        height="1px"
        bg="rgba(0, 0, 0, 0.08)"
      />

      <Stack
        w="100%"
        pr={{ base: "0", md: "2.8rem" }}
        spacing={{ base: 4, md: 12 }}
      >
        <Heading as="h3" fontSize={{ base: "lg", md: "2xl" }}>
          Account Details
        </Heading>

        <chakra.form onSubmit={onSave}>
          <Stack spacing={12}>
            <FormControl id="name" isInvalid={errors.name} isRequired>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <Input
                type="text"
                placeholder="James Bond"
                variant="flushed"
                disabled={updateDetailsMutation.isLoading}
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
                disabled={updateDetailsMutation.isLoading}
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
                disabled={updateDetailsMutation.isLoading}
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
                disabled={updateDetailsMutation.isLoading}
                value={formValue.address}
                onChange={(e) =>
                  setFormValue({ ...formValue, address: e.target.value })
                }
              />
              <FormErrorMessage>Address is required</FormErrorMessage>
            </FormControl>
          </Stack>

          <Button type="submit" variant="solid" px="12" py="6" mt="4rem">
            Save Details
          </Button>
        </chakra.form>
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let layoutProps = await getLayoutProps(ctx);
  if (!layoutProps) return { notFound: true };

  let props: any = {
    layoutProps: {
      ...layoutProps,
      title: "Account",
    },
  };

  if (!layoutProps.account) {
    return { props };
  }

  const user = await prisma.user.findUnique({
    where: { address: props.layoutProps.account },
    select: { shippingDetails: true },
  });
  props.accountDetails = user?.shippingDetails;

  return { props };
};

Page.Layout = CustomerLayout;
export default Page;
