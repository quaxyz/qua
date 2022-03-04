import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Api from "libs/api";
import {
  chakra,
  Container,
  Stack,
  Image,
  Link,
  Text,
  Input,
  Button,
  useBreakpointValue,
  useToast,
  Spacer,
} from "@chakra-ui/react";
// import { Wallet } from "components/wallet";
import SelectMenu from "components/select";
import { useMutation } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { defaultCategories, domain, schemas } from "libs/constants";
import { providers } from "ethers";
import { useRouter } from "next/router";
import { FormGroup } from "components/form-group";
import NextLink from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Wallet } from "react-iconly";

function useCreateStore() {
  const { library, account } = useWeb3React();
  const toast = useToast();
  const router = useRouter();

  const createStoreMutation = useMutation(async (payload: any) => {
    return Api().post("/setup", payload);
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
        pathname: `/_store/[store]/dashboard/settings`,
        query: { store: message.store.toLowerCase() },
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
    <>
      <Head>
        <title>Setup store - Qua</title>
      </Head>

      <chakra.header
        borderBottom={{ base: "1px solid rgba(0, 0, 0, 0.08)", md: "none" }}
        pos={{ base: "relative", md: "fixed" }}
        top="0"
        w="100%"
        zIndex="2"
      >
        <Container
          maxW="100%"
          px={{ base: "4", md: "16" }}
          py={{ base: "4", md: "8" }}
        >
          <Stack direction="row" alignItems="center" justify="space-between">
            <Image
              src="/svg/qua_mark_white.svg"
              display={{ base: "none", md: "block" }}
              boxSize="70"
              alt="Qua logo"
            />
            <Image
              src="/svg/qua_mark_black.svg"
              boxSize="50"
              display={{ base: "block", md: "none" }}
              alt="Qua logo"
            />

            <Stack direction="row" spacing="8">
              <NextLink href="/" passHref>
                <Link>Log in</Link>
              </NextLink>
            </Stack>
          </Stack>
        </Container>
      </chakra.header>

      <Container maxW="100%" p="0" m="0">
        <Stack direction={{ base: "column", md: "row" }} align="center">
          <chakra.aside
            // display={{ base: "none", md: "block" }}
            h={{ base: "80px", md: "100vh" }}
            w={{ base: "100%", md: "550px" }}
            bgImage="url(/images/yash-bindra-NcMuToAOPUY-unsplash.jpg)"
            bgRepeat="no-repeat"
            bgSize="cover"
            bgPosition="center center"
            position="relative"
          />

          <chakra.main
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
            px={{ base: "8", md: "0" }}
            pt={{ base: "6", md: "0" }}
          >
            <Stack w={{ base: "100%", md: "60%" }} justify="center">
              <chakra.form flex="2" onSubmit={onSubmit}>
                <Text>
                  <Text fontSize={{ base: "1.125rem", md: "1.2rem" }}>
                    Welcome,
                  </Text>
                  <Text
                    as="span"
                    color="#131415"
                    fontWeight="600"
                    fontSize={{ base: "1.4rem", md: "1.8rem" }}
                  >
                    Let&apos;s set you up!
                  </Text>
                </Text>

                <Stack
                  py={{ base: "8", md: "12" }}
                  spacing={{ base: "8", md: "12" }}
                >
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={{ base: "4", md: "8" }}
                  >
                    <Button
                      flex={{ base: "block", md: "1" }}
                      size="lg"
                      variant="solid-outline"
                      color="#131415"
                      leftIcon={<FcGoogle fontSize="24px" />}
                    >
                      Sign up with Google
                    </Button>
                    <Button
                      flex={{ base: "block", md: "1" }}
                      size="lg"
                      variant="solid-outline"
                      color="#131415"
                      leftIcon={<Wallet set="bold" />}
                    >
                      Connect Wallet
                    </Button>
                  </Stack>
                  <Stack direction="row" align="center" spacing={4}>
                    <Spacer w="100%" h="1px" bgColor="rgba(19, 20, 21, 0.08)" />
                    <Text lineHeight="1px">OR</Text>
                    <Spacer w="100%" h="1px" bgColor="rgba(19, 20, 21, 0.08)" />
                  </Stack>

                  <FormGroup
                    id="email"
                    label="Email"
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
                    id="psword"
                    label="Password"
                    labelProps={{ variant: "flushed" }}
                  >
                    <Input
                      isRequired
                      type="password"
                      placeholder="••••••"
                      variant="flushed"
                      size="lg"
                      value={formValue.email}
                      onChange={(e) =>
                        setFormValue({ ...formValue, email: e.target.value })
                      }
                    />
                  </FormGroup>

                  <div>
                    <Button
                      size="lg"
                      variant="solid"
                      type="submit"
                      isLoading={sending}
                      isFullWidth={useBreakpointValue({
                        base: true,
                        md: false,
                      })}
                    >
                      Create my account
                    </Button>
                  </div>
                </Stack>
              </chakra.form>
            </Stack>
          </chakra.main>
        </Stack>
      </Container>
    </>
  );
};

export default Page;
