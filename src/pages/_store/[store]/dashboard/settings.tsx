import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import { GetStaticProps } from "next";
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
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { useRouter } from "next/router";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { useFileUpload } from "components/file-picker";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { defaultCategories } from "libs/constants";
import { getStorePaths } from "libs/store-paths";

function useSaveSettings() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const updateStoreMutation = useMutation(
    async (payload: any) => {
      return Api().post(`/dashboard/settings`, payload);
    },
    {
      onSuccess: ({ payload: result }) => {
        queryClient.setQueryData("store-details", result.settings);
        toast({
          title: "Saved settings",
          position: "top-right",
          status: "success",
        });
      },
      onError: (err: any) => {
        toast({
          title: "Error saving settings",
          description: err?.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return updateStoreMutation;
}

const Page = ({ storeDetails }: any) => {
  const router = useRouter();
  const [formValue, setFormValue] = React.useState({
    ownerAddress: storeDetails.owner.address || "",
    about: storeDetails.about || "",
    location: storeDetails.location || "",
    whatsapp: storeDetails.socialLinks?.whatsapp || "",
    instagram: storeDetails.socialLinks?.instagram || "",
    bankName: storeDetails.bankDetails?.name || "",
    bankAccountNumber: storeDetails.bankDetails?.accountNumber || "",
    bankAccountName: storeDetails.bankDetails?.accountName || "",
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
    onUpload: async ([file]) => saveSettings.mutateAsync({ image: file }),
  });

  const onDetailsSubmit = (e: any) => {
    e.preventDefault();

    const details = {
      address: formValue.ownerAddress,
      about: formValue.about,
      location: formValue.location,
      deliveryFee: formValue.deliveryFee,
      socialLinks: {
        whatsapp: formValue.whatsapp,
        instagram: formValue.instagram,
      },
      bankDetails: {
        name: formValue.bankName,
        accountNumber: formValue.bankAccountNumber,
        accountName: formValue.bankAccountName,
      },
    };

    saveSettings.mutate(details);
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
              if (data?.title !== title) saveSettings.mutateAsync({ title });
            }}
            isDisabled={saveSettings.isLoading}
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
          isLoading={saveSettings.isLoading || filePicker.loading}
          isDisabled={saveSettings.isLoading}
          variant="primary"
          colorScheme="black"
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
            spacing={{ base: "4", md: "16" }}
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
                  value={formValue.bankAccountName}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      bankAccountName: e.target.value,
                    })
                  }
                  placeholder="Account name"
                />
              </FormControl>
              <FormControl id="">
                <Input
                  id="location"
                  variant="outline"
                  type="number"
                  value={formValue.bankAccountNumber}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  placeholder="Account number"
                />
              </FormControl>
              <FormControl id="">
                <Input
                  id="location"
                  variant="outline"
                  type="text"
                  value={formValue.bankName}
                  onChange={(e) =>
                    setFormValue({ ...formValue, bankName: e.target.value })
                  }
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

              <GridItem>
                <FormControl id="address">
                  <FormLabel textTransform="uppercase" opacity="72%">
                    Crypto Wallet Address
                  </FormLabel>
                  <Input
                    variant="flushed"
                    type="text"
                    value={formValue.ownerAddress}
                    onChange={(e) =>
                      setFormValue({
                        ...formValue,
                        ownerAddress: e.target.value,
                      })
                    }
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
            isLoading={saveSettings.isLoading}
            isDisabled={filePicker.loading}
          >
            Save Changes
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const store = (params?.store || "") as string;
  const storeDetails = await prisma.store.findUnique({
    where: { name: store },
    include: {
      owner: {
        select: {
          email: true,
          address: true,
        },
      },
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
      revalidate: 5 * 60 * 60,
    };
  }

  return {
    props: {
      storeDetails: JSON.parse(JSON.stringify(storeDetails)),
      layoutProps: {
        title: "Settings",
      },
    },
    revalidate: 5 * 60 * 60,
  };
};

export const getStaticPaths = getStorePaths;

Page.Layout = StoreDashboardLayout;
export default Page;
