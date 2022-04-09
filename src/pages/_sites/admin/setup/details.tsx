import React from "react";
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
} from "@chakra-ui/react";
import SelectMenu from "components/select";
import { useMutation } from "react-query";
import { defaultCategories } from "libs/constants";
import { useRouter } from "next/router";
import { FormGroup } from "components/form-group";

const Page = () => {
  const router = useRouter();
  const [formValue, setFormValue] = React.useState({
    name: "",
    category: null as any,
  });

  const createStore = useMutation(async (payload: any) => {
    return Api().post("/admin/setup/details", payload);
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStore.mutateAsync(formValue);

    router.push(`/${formValue.name.toLowerCase()}/settings`);
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
          </Stack>
        </Container>
      </chakra.header>

      <Container maxW="100%" p="0" m="0">
        <Stack direction={{ base: "column", md: "row" }} align="center">
          <chakra.aside
            h={{ base: "80px", md: "100vh" }}
            w={{ base: "100%", md: "30vw" }}
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
                <div>
                  <Text
                    fontSize={{ base: "1.125rem", md: "1.125rem" }}
                    opacity="0.48"
                    color="#131415"
                  >
                    Complete setup,
                  </Text>
                  <Text
                    as="span"
                    color="#131415"
                    fontWeight="300"
                    fontSize={{ base: "1.4rem", md: "2rem" }}
                  >
                    One Last Thing!
                  </Text>
                </div>

                <Stack py={{ base: "8", md: "12" }} spacing={12}>
                  <FormGroup
                    id="name"
                    label="Your Brand Name"
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
                    id="category"
                    label="Business Category"
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
                      options={defaultCategories}
                    />
                  </FormGroup>

                  <div>
                    <Button
                      size="lg"
                      variant="solid"
                      type="submit"
                      isLoading={createStore.isLoading}
                      isFullWidth={useBreakpointValue({
                        base: true,
                        md: false,
                      })}
                    >
                      Create my store
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
