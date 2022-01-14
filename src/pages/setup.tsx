import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Api from "libs/api";
import {
  chakra,
  Container,
  Stack,
  Image,
  Text,
  Input,
  Button,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";
import SelectMenu from "components/select";
import { useMutation } from "react-query";
import { useActiveWeb3React } from "hooks/web3";
import { domain, schemas } from "libs/constants";
import { providers } from "ethers";
import { useRouter } from "next/router";
import { FormGroup } from "components/form-group";

function useCreateStore() {
  const { library, account } = useActiveWeb3React();
  const toast = useToast();
  const router = useRouter();

  const createStoreMutation = useMutation(async (payload: any) => {
    return Api().post("/api/setup", payload);
  });

  return async (details: any) => {
    if (!library || !account) {
      console.error("useClient:", "Library or account is not ready", {
        library,
        account,
      });
      toast({
        title: "Error saving details",
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
      store: details.name,
      details: JSON.stringify(details),
    };

    const data = {
      domain,
      types: { Store: schemas.Store },
      message,
    };

    try {
      const sig = await signer._signTypedData(
        data.domain,
        data.types,
        data.message
      );
      console.log("Sign", { address: account, sig, data });

      const { payload: result } = await createStoreMutation.mutateAsync({
        address: account,
        sig,
        data,
      });
      console.log("Result", result);

      router.push({
        pathname: `/[store]/app/settings`,
        query: { store: message.store },
      });
    } catch (err: any) {
      toast({
        title: "Error saving details",
        description: err.message,
        position: "bottom-right",
        status: "error",
      });
    }
  };
}

const Page: NextPage = () => {
  const createStore = useCreateStore();

  const [formValue, setFormValue] = React.useState({
    name: "",
    email: "",
    category: null as any,
  });

  const [sending, setSending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    console.log("Data", formValue);

    // sign and save data
    await createStore(formValue);

    setSending(false);
  };

  return (
    <div>
      <Head>
        <title>Setup store - Qua</title>
      </Head>

      <chakra.header borderBottom="1px" borderColor="rgba(0, 0, 0, 0.08)">
        <Container maxW="container.xl" py={4}>
          <Stack direction="row" alignItems="center" justify="space-between">
            <Image src="/logo.svg" alt="Qua logo" />

            <Stack direction="row" spacing={3}>
              <Wallet />
            </Stack>
          </Stack>
        </Container>
      </chakra.header>

      <chakra.main>
        <Container maxW="container.lg" py={14}>
          <Stack
            direction={useBreakpointValue({ base: "column", md: "row" })}
            justify="space-between"
          >
            <chakra.form flex="3" onSubmit={onSubmit}>
              <Text>
                Welcome 🎉, <br />{" "}
                <Text as="span" fontWeight="bold">
                  Let’s set you up!
                </Text>
              </Text>

              <Stack py={12} spacing={12}>
                <FormGroup
                  id="name"
                  label="Business name"
                  labelProps={{ variant: "flushed" }}
                  rightAddonText=".qua.xyz"
                >
                  <Input
                    isRequired
                    type="text"
                    placeholder="shooshow"
                    variant="flushed"
                    size="lg"
                    value={formValue.name}
                    onChange={(e) =>
                      setFormValue({ ...formValue, name: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup
                  id="email"
                  label="Email address"
                  labelProps={{ variant: "flushed" }}
                >
                  <Input
                    isRequired
                    type="email"
                    placeholder="shoo@mail.com"
                    variant="flushed"
                    size="lg"
                    value={formValue.email}
                    onChange={(e) =>
                      setFormValue({ ...formValue, email: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup
                  id="category"
                  label="Business category"
                  labelProps={{ variant: "flushed" }}
                >
                  <SelectMenu
                    title="Select Category"
                    placeholder="Select"
                    variant="flushed"
                    size="lg"
                    value={formValue.category}
                    onChange={(item) =>
                      setFormValue({ ...formValue, category: item })
                    }
                    options={[
                      { value: "clothing", label: "Clothing" },
                      { value: "cosmetics", label: "Cosmetics" },
                      { value: "food", label: "Food" },
                    ]}
                  />
                </FormGroup>

                <div>
                  <Button
                    size="lg"
                    variant="solid"
                    type="submit"
                    isLoading={sending}
                    isFullWidth={useBreakpointValue({ base: true, md: false })}
                  >
                    Create my store
                  </Button>
                </div>
              </Stack>
            </chakra.form>

            <chakra.div flex="1" />
          </Stack>
        </Container>
      </chakra.main>
    </div>
  );
};

export default Page;
