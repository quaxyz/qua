import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  chakra,
  Container,
  Stack,
  Image,
  Text,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Wallet } from "components/wallet";
import SelectMenu from "components/select";

type FormGroupProps = {
  id: string;
  label?: string;
  helperText?: string;
  rightAddonText?: string;
  required?: boolean;
  children: any;
};
const FormGroup = ({ id, label, helperText, rightAddonText, required, children }: FormGroupProps) => (
  <FormControl id={id} isRequired={required}>
    <FormLabel fontWeight="500">{label}</FormLabel>

    <Stack
      pr={3}
      alignItems="center"
      direction="row"
      borderBottom="1px solid rgb(0 0 0 / 24%)"
      _hover={{
        borderColor: "rgb(0 0 0 / 60%)",
      }}
    >
      {React.cloneElement(children, {
        border: "none",
        rounded: "0px",
        px: 0,
        py: 6,
        fontWeight: 700,
        fontSize: "2xl",
        flex: 1,
        _placeholder: {
          color: "rgb(0 0 0 / 12%)",
        },
        _focus: {
          outline: "none",
        },
      })}

      {rightAddonText && (
        <Text fontSize="2xl" fontWeight="500">
          {rightAddonText}
        </Text>
      )}
    </Stack>

    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

const OnboardSetup: NextPage = () => {
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
          <Stack direction={useBreakpointValue({ base: "column", md: "row" })} justify="space-between">
            <chakra.div flex="3">
              <Text>
                Welcome 🎉, <br />{" "}
                <Text as="span" fontWeight="bold">
                  Let’s set you up!
                </Text>
              </Text>

              <Stack py={12} spacing={12}>
                <FormGroup id="name" label="Business name" rightAddonText=".qua.xyz">
                  <Input type="text" placeholder="shooshow" />
                </FormGroup>

                <FormGroup id="email" label="Email address">
                  <Input type="email" placeholder="shoo@mail.com" />
                </FormGroup>

                <FormGroup id="category" label="Business category">
                  <SelectMenu
                    title="Select Category"
                    placeholder="Select"
                    onSelect={() => null}
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
                    isFullWidth={useBreakpointValue({ base: true, md: false })}
                    disabled
                  >
                    Create my store
                  </Button>
                </div>
              </Stack>
            </chakra.div>

            <chakra.div flex="1" />
          </Stack>
        </Container>
      </chakra.main>
    </div>
  );
};

export default OnboardSetup;
