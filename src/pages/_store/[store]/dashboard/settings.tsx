import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import { GetServerSideProps } from "next";
import {
  Box,
  Button,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
  Icon,
  useToast,
  FormHelperText,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { getKeyPair } from "libs/keys";
import { signData } from "libs/signing";
import { useFileUpload } from "components/file-picker";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { defaultCategories } from "libs/constants";

function useSaveSettings() {
  const [loading, setLoading] = React.useState(false);

  const { account } = useWeb3React();
  const toast = useToast();
  const queryClient = useQueryClient();

  const updateStoreMutation = useMutation(
    async (payload: any) => {
      return Api().post(`/dashboard/settings`, payload);
    },
    {
      onSuccess: ({ payload: result }) => {
        queryClient.setQueryData("store-details", result.settings);
      },
    }
  );

  const saveStore = async (details: any) => {
    try {
      setLoading(true);

      // sign data
      const timestamp = parseInt((Date.now() / 1000).toFixed());

      const keyPair = await getKeyPair();
      const data = {
        ...details,
        timestamp,
      };
      console.log("Data", data);

      const signedContent = await signData(keyPair, data);
      console.log("Sig", signedContent);

      // send data to server
      const { payload: result } = await updateStoreMutation.mutateAsync({
        address: account,
        digest: signedContent.digest,
        key: JSON.stringify(signedContent.publicKey),
        payload: JSON.stringify(data),
        signature: signedContent.signature,
        timestamp,
      });

      console.log("Result", result);

      toast({
        title: "Settings updated",
        position: "top-right",
        status: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error saving details",
        description: error.message,
        position: "bottom-right",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, saveStore };
}

const Page = ({ storeDetails }: any) => {
  const router = useRouter();
  const [formValue, setFormValue] = React.useState({
    about: storeDetails.about || "",
    location: storeDetails.location || "",
    whatsapp: storeDetails.socialLinks?.whatsapp || "",
    instagram: storeDetails.socialLinks?.instagram || "",
    deliveryFee: storeDetails.deliveryFee || 0,
  });

  const { data } = useQuery({
    queryKey: "store-details",
    queryFn: async () => {},
    initialData: storeDetails,
    staleTime: Infinity,
  });

  const saveSettings = useSaveSettings();
  const filePicker = useFileUpload({
    bucket: router.query.store as string,
    onUpload: async ([file]) => saveSettings.saveStore({ image: file }),
  });

  const onDetailsSubmit = (e: any) => {
    e.preventDefault();

    const details = {
      about: formValue.about,
      location: formValue.location,
      deliveryFee: formValue.deliveryFee,
      socialLinks: {
        whatsapp: formValue.whatsapp,
        instagram: formValue.instagram,
      },
    };

    saveSettings.saveStore(details);
  };

  return (
    <>
      <Box
        maxWidth="100%"
        height="50vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        // we could fetch unsplash image here based on store category
        bgImage={`linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),url('${
          data?.image?.url || "/images/fakurian-design-GJKx5lhwU3M-unsplash.jpg"
        }')`}
        bgPosition="center center"
        bgRepeat="no-repeat"
        bgSize="cover"
        color="#fff"
      >
        <Text
          fontSize={{ base: "sm", md: "md" }}
          textTransform="uppercase"
          fontWeight="800"
          letterSpacing="0.15px"
          color="#fff"
          background="rgba(255, 255, 255, 0.28)"
          py="2"
          px="4"
          mb="2"
          borderRadius="50"
          userSelect="none"
        >
          {defaultCategories.find((c) => c.value === data?.category)?.label}
        </Text>
        <Heading as="h2" opacity="48%" fontSize={{ base: "2rem", md: "4rem" }}>
          <Editable
            defaultValue={data?.title || "Store Title"}
            onSubmit={(title) => {
              if (data?.title !== title) saveSettings.saveStore({ title });
            }}
            isDisabled={saveSettings.loading}
          >
            <EditablePreview />
            <EditableInput
              textAlign="center"
              transition=".2s"
              outline="0.5px solid"
              outlineColor="rgba(0, 0, 0, 0.80)"
              borderRadius="0"
            />
          </Editable>
        </Heading>
      </Box>

      <Flex
        justifyContent="flex-end"
        alignItems="center"
        width="100%"
        mt="-4rem"
        pr="2rem"
      >
        <Button
          onClick={() => filePicker.open()}
          isLoading={saveSettings.loading || filePicker.loading}
          isDisabled={saveSettings.loading}
          variant="primary"
        >
          Upload image
        </Button>

        <input {...filePicker.getInputProps()} />
      </Flex>

      <Container maxW="100%" px={{ base: "4", md: "12" }} py={20}>
        <Stack
          spacing="4rem"
          align="flex-start"
          as="form"
          onSubmit={onDetailsSubmit}
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: "4", md: "24" }}
            w="100%"
          >
            <Stack w="full" spacing={6}>
              <Heading fontSize="lg" textTransform="uppercase" opacity="80%">
                About
              </Heading>
              <Textarea
                id="about"
                placeholder="What should customers know about your business?"
                value={formValue?.about}
                onChange={(e) =>
                  setFormValue({ ...formValue, about: e.target.value })
                }
                size="md"
                borderRadius="0"
                rows={10}
              />
            </Stack>

            <Stack w={{ base: "100%", md: "460px" }} spacing={6}>
              <Heading fontSize="sm" textTransform="uppercase" opacity="80%">
                Bank Transfer details
              </Heading>
              <FormControl id="">
                <Input
                  id="location"
                  variant="outline"
                  type="text"
                  // value={formValue.location}
                  // onChange={(e) =>
                  //   setFormValue({ ...formValue, location: e.target.value })
                  // }
                  placeholder="Account name"
                />
              </FormControl>
              <FormControl id="">
                <Input
                  id="location"
                  variant="outline"
                  type="number"
                  // value={formValue.location}
                  // onChange={(e) =>
                  //   setFormValue({ ...formValue, location: e.target.value })
                  // }
                  placeholder="Account number"
                />
              </FormControl>
              <FormControl id="">
                <Input
                  id="location"
                  variant="outline"
                  type="text"
                  // value={formValue.location}
                  // onChange={(e) =>
                  //   setFormValue({ ...formValue, location: e.target.value })
                  // }
                  placeholder="Bank name"
                />
              </FormControl>
            </Stack>
          </Stack>

          <Stack w="full" spacing={12}>
            <Heading fontSize="3xl" fontWeight="500">
              Settings
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
              gridRowGap={8}
              gridColumnGap={12}
            >
              <GridItem>
                <FormControl id="location">
                  <FormLabel textTransform="uppercase" opacity="72%">
                    Bussiness Location
                  </FormLabel>
                  <Input
                    id="location"
                    variant="flushed"
                    type="text"
                    value={formValue.location}
                    onChange={(e) =>
                      setFormValue({ ...formValue, location: e.target.value })
                    }
                    placeholder="Enter address"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="name">
                  <FormLabel textTransform="uppercase" opacity="72%">
                    Store Contacts
                  </FormLabel>
                  <Stack direction="row">
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon
                          as={AiFillInstagram}
                          boxSize="5"
                          color="#E4405F"
                        />
                      </InputLeftElement>

                      <Input
                        id="instagram"
                        type="text"
                        variant="flushed"
                        fontSize="sm"
                        placeholder="@myusername"
                        value={formValue.instagram}
                        onChange={(e) =>
                          setFormValue({
                            ...formValue,
                            instagram: e.target.value,
                          })
                        }
                      />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={IoLogoWhatsapp} boxSize="5" color="#25D366" />
                      </InputLeftElement>

                      <Input
                        id="whatsapp"
                        type="text"
                        variant="flushed"
                        fontSize="sm"
                        placeholder="+01 234 567 890"
                        value={formValue.whatsapp}
                        onChange={(e) =>
                          setFormValue({
                            ...formValue,
                            whatsapp: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </Stack>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="deliveryFee">
                  <FormLabel textTransform="uppercase" opacity="72%">
                    Base shipping fee ($)
                  </FormLabel>
                  <Input
                    id="deliveryFee"
                    variant="flushed"
                    type="number"
                    value={formValue.deliveryFee}
                    onChange={(e) =>
                      setFormValue({
                        ...formValue,
                        deliveryFee: e.target.value,
                      })
                    }
                    placeholder="Enter base delivery fee"
                  />
                </FormControl>
              </GridItem>

              {/* <GridItem>
                <FormControl id="name" isDisabled>
                  <FormLabel textTransform="uppercase">Store name</FormLabel>
                  <Input
                    variant="outline"
                    type="text"
                    defaultValue={storeDetails.name}
                  />
                </FormControl>
              </GridItem> */}

              {/* <GridItem>
                <FormControl id="category" isDisabled>
                  <FormLabel textTransform="uppercase">Category</FormLabel>
                  <Input
                    variant="outline"
                    type="text"
                    defaultValue={
                      defaultCategories.find(
                        (c) => c.value === storeDetails.category
                      )?.label
                    }
                  />
                </FormControl>
              </GridItem> */}

              <GridItem>
                <FormControl id="address">
                  <FormLabel textTransform="uppercase" opacity="72%">
                    Crypto Wallet Address
                  </FormLabel>
                  <Input
                    variant="flushed"
                    type="text"
                    defaultValue={storeDetails.owner}
                  />
                  <FormHelperText
                    fontStyle="italic"
                    fontSize="xs"
                    color="#131415"
                    opacity="48%"
                  >
                    Crypto Payments will go to this address
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>
          </Stack>

          <Button
            type="submit"
            size="lg"
            isLoading={saveSettings.loading}
            isDisabled={saveSettings.loading}
          >
            Save Changes
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = (params?.store || "") as string;
  const storeDetails = await prisma.store.findUnique({
    where: { name: store },
    include: {
      image: {
        select: {
          url: true,
        },
      },
    },
  });

  if (!storeDetails) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      storeDetails: JSON.parse(JSON.stringify(storeDetails)),
      layoutProps: {
        title: "Settings",
      },
    },
  };
};

Page.Layout = StoreDashboardLayout;
export default Page;
