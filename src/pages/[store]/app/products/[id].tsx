import React from "react";
import prisma from "libs/prisma";
import Api from "libs/api";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import NextLink from "next/link";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import {
  Box,
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
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FilePicker } from "components/file-picker";
import { FormGroup } from "components/form-group";
import { CreateableSelectMenu } from "components/select";
import { ArrowLeft } from "react-iconly";
import { useWeb3React } from "@web3-react/core";
import { getKeyPair } from "libs/keys";
import { signData } from "libs/signing";
import { useMutation, useQueryClient } from "react-query";

const Variants = (props: {
  variants: any[];
  onChange: (variants: any[]) => void;
}) => {
  const [variants, setVariants] = React.useState(
    props.variants || [{ type: "", options: "" }]
  );

  const onVariantChange = (data: any, variantIdx: number) => {
    const newVariants = variants.map((variant, idx) => {
      if (idx === variantIdx) return data;
      return variant;
    });

    setVariants(newVariants);
    props.onChange(newVariants);
  };

  const addVariant = () => {
    setVariants(variants.concat({ type: "", options: "" }));

    props.onChange(variants);
  };

  return (
    <>
      {variants.map((variant, idx) => (
        <Stack
          key={idx}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="flex-end"
          spacing={5}
          mb={6}
        >
          <Box flex={1}>
            <FormGroup id="options" label="Option 1">
              <CreateableSelectMenu
                title="Choose Option"
                placeholder="Choose"
                variant="flushed"
                value={variant.type}
                size="sm"
                onChange={(value) =>
                  onVariantChange(
                    {
                      ...variant,
                      type: value,
                    },
                    idx
                  )
                }
                defaultOptions={[
                  { value: "title", label: "Title" },
                  { value: "color", label: "Color" },
                  { value: "size", label: "Size" },
                  { value: "material", label: "Material" },
                  { value: "style", label: "Style" },
                ]}
              />
            </FormGroup>
          </Box>

          <Box flex={3}>
            <FormGroup id="discountPrice">
              <Input
                isRequired
                placeholder="Seperate options with a comma"
                variant="outline"
                value={variant.options}
                onChange={(e) =>
                  onVariantChange(
                    {
                      ...variant,
                      options: e.target.value,
                    },
                    idx
                  )
                }
              />
            </FormGroup>
          </Box>
        </Stack>
      ))}

      <Button onClick={addVariant} variant="solid-outline">
        Add another option
      </Button>
    </>
  );
};

const Page: NextPage = ({ product }: any) => {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { account } = useWeb3React();

  const [saving, setSaving] = React.useState(false);
  const [hasVariant, setHasVariant] = React.useState(
    product.variants && product.variants.length
  );
  const [isLimited, setIsLimited] = React.useState(
    (product.totalStocks || 0) > 0 || false
  );

  const [errors, setErrors] = React.useState<any>({});
  const [formValue, setFormValue] = React.useState({
    name: product.name || "",
    description: product.description || "",
    images: product.images || [],
    price: product.price || "",
    discountPrice: product.discountPrice || "",
    stock: product.totalStocks || "",
    physical: product.physical || false,
    category: product.category || "",
    tags: product.tags.join(",") || "",
    variants: (product.variants || []).map((variant: any) => ({
      ...variant,
      options: variant.options.join(","),
    })),
  });

  const updateProductMutation = useMutation(
    async (payload: any) => {
      return Api().post(
        `/api/${router.query?.store}/app/products/${product.id}`,
        payload
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("store-dashboard-products");
      },
    }
  );

  const checkForErrors = (state: any) => ({
    name: !state.name || state.name.length < 1,
    price: !state.price || state.price.length < 1,
    images: !state.images || state.images.length < 1 || state.images.length > 8,
  });

  const onPublish = async () => {
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

      // sign data
      const timestamp = parseInt((Date.now() / 1000).toFixed());
      const keyPair = await getKeyPair();
      const data = {
        ...formValue,
        timestamp,
      };

      console.log("Data", data);

      const signedContent = await signData(keyPair, data);
      console.log("Sig", signedContent);

      // send data to server
      const { payload: result } = await updateProductMutation.mutateAsync({
        address: account,
        digest: signedContent.digest,
        key: JSON.stringify(signedContent.publicKey),
        payload: JSON.stringify(data),
        signature: signedContent.signature,
        timestamp,
      });
      console.log("Result", result);

      toast({
        title: "Product updated",
        position: "top-right",
        status: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error saving product",
        description: error.message,
        position: "bottom-right",
        status: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <StoreDashboardLayout title="Edit product">
      <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
        <Stack direction="row" justify="space-between" aling="center" mb={10}>
          <NextLink href={`/${router?.query.store}/app/products/`} passHref>
            <Stack as={Link} border="none" direction="row" alignItems="center">
              <ArrowLeft set="light" />

              <Heading as="h2" fontSize="lg" fontWeight="600">
                All Products
              </Heading>
            </Stack>
          </NextLink>

          <Button variant="primary" onClick={onPublish} isLoading={saving}>
            Update
          </Button>
        </Stack>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "8", md: "14" }}
        >
          <Stack w="full" flex={2} spacing={10}>
            <FormControl id="name" isInvalid={errors.name}>
              <FormLabel htmlFor="name">Product Name</FormLabel>
              <Input
                isRequired
                type="text"
                placeholder="Hair growth oil"
                variant="outline"
                disabled={saving}
                value={formValue.name}
                onChange={(e) =>
                  setFormValue({ ...formValue, name: e.target.value })
                }
              />
              <FormErrorMessage>Name is required</FormErrorMessage>
            </FormControl>

            <FormControl id="images" isInvalid={errors.images}>
              <FormLabel htmlFor="images">Media</FormLabel>
              <FilePicker
                files={formValue.images}
                bucket={router.query.store as string}
                disabled={saving}
                maxFiles={8}
                setFiles={(images) => setFormValue({ ...formValue, images })}
              />
              <FormErrorMessage>
                Each product needs at least 1 image and no more than 8 images
              </FormErrorMessage>
            </FormControl>

            <Tabs>
              <TabList>
                <Tab>Description</Tab>
                <Tab>Details</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <FormGroup id="description">
                    <Textarea
                      rows={8}
                      fontSize={{ base: "0.9375rem", md: "1rem" }}
                      placeholder="Tell customers more about the product..."
                      disabled={saving}
                      value={formValue.description}
                      onChange={(e) =>
                        setFormValue({
                          ...formValue,
                          description: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </TabPanel>

                <TabPanel>
                  <Stack spacing={4}>
                    <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                      <Heading fontSize="md" fontWeight="600" mb={6}>
                        Pricing
                      </Heading>

                      <Stack
                        direction="row"
                        justify="space-between"
                        spacing={6}
                      >
                        <FormControl id="price" isInvalid={errors.price}>
                          <FormLabel htmlFor="price">Price</FormLabel>
                          <Input
                            isRequired
                            type="number"
                            placeholder="0.00"
                            variant="flushed"
                            disabled={saving}
                            value={formValue.price}
                            onChange={(e) =>
                              setFormValue({
                                ...formValue,
                                price: e.target.value,
                              })
                            }
                          />
                          <FormErrorMessage>Price is required</FormErrorMessage>
                        </FormControl>

                        <FormGroup id="discountPrice" label="Discount Price">
                          <Input
                            isRequired
                            type="number"
                            placeholder="0.00"
                            variant="flushed"
                            disabled={saving}
                            value={formValue.discountPrice}
                            onChange={(e) =>
                              setFormValue({
                                ...formValue,
                                discountPrice: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Stack>
                    </chakra.article>

                    <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                      <Heading fontSize="md" fontWeight="600" mb={6}>
                        Stock
                      </Heading>

                      <Checkbox
                        mb={6}
                        disabled={saving}
                        isChecked={isLimited}
                        onChange={(e) => setIsLimited(e.target.checked)}
                      >
                        This is a limited product
                      </Checkbox>

                      {isLimited && (
                        <Stack
                          direction="row"
                          justify="space-between"
                          spacing={6}
                        >
                          <FormControl
                            w="50%"
                            id="stock"
                            isInvalid={errors.stock}
                          >
                            <FormLabel htmlFor="stock">Total stocks</FormLabel>
                            <Input
                              type="number"
                              placeholder="0"
                              variant="flushed"
                              disabled={saving}
                              value={formValue.stock}
                              onChange={(e) =>
                                setFormValue({
                                  ...formValue,
                                  stock: e.target.value,
                                })
                              }
                            />
                          </FormControl>
                        </Stack>
                      )}
                    </chakra.article>

                    <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                      <Heading fontSize="md" fontWeight="600" mb={6}>
                        Shipping
                      </Heading>

                      <Checkbox
                        mb={6}
                        disabled={saving}
                        isChecked={formValue.physical}
                        onChange={(e) =>
                          setFormValue({
                            ...formValue,
                            physical: e.target.checked,
                          })
                        }
                      >
                        This is a physical product
                      </Checkbox>

                      {!formValue.physical && (
                        <Text fontSize="sm" color="rgb(0 0 0 / 62%)">
                          * Customers won&apos;t enter their shipping address or
                          choose a shipping method when buying this product.
                        </Text>
                      )}
                    </chakra.article>

                    <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                      <Heading fontSize="md" fontWeight="600" mb={6}>
                        Variants
                      </Heading>

                      <Checkbox
                        mb={8}
                        disabled={saving}
                        isChecked={hasVariant}
                        onChange={(e) => setHasVariant(e.target.checked)}
                      >
                        This product has multiple options, like different sizes
                        or colors
                      </Checkbox>

                      {hasVariant && (
                        <Variants
                          variants={formValue.variants}
                          onChange={(variants) =>
                            setFormValue({ ...formValue, variants })
                          }
                        />
                      )}
                    </chakra.article>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>

          <Stack w="full" flex={1} spacing={5}>
            <Stack
              divider={<StackDivider borderColor="rgb(0 0 0 / 8%)" />}
              border="1px solid rgb(0 0 0 / 16%)"
            >
              <chakra.article p={4}>
                <Heading fontSize="lg" mb={2}>
                  Category
                </Heading>
                <Text fontSize="sm" mb={4}>
                  Add this product to a category or create a new category.
                </Text>

                <FormGroup id="category">
                  <CreateableSelectMenu
                    title="Select Category"
                    placeholder="Select"
                    variant="outline"
                    size="md"
                    disabled={saving}
                    value={formValue.category}
                    onChange={(value) =>
                      setFormValue({ ...formValue, category: value })
                    }
                    defaultOptions={[
                      { value: "clothing", label: "Clothing" },
                      { value: "cosmetics", label: "Cosmetics" },
                      { value: "food", label: "Food" },
                    ]}
                  />
                </FormGroup>
              </chakra.article>

              <chakra.article p={4}>
                <FormGroup
                  id="tag"
                  label="Tags"
                  labelProps={{ fontSize: "sm" }}
                >
                  <Input
                    placeholder="Vintage, cotton, summer"
                    disabled={saving}
                    value={formValue.tags}
                    onChange={(e) =>
                      setFormValue({ ...formValue, tags: e.target.value })
                    }
                  />
                </FormGroup>
              </chakra.article>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </StoreDashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = params?.store as string;
  const id = params?.id as string;

  const product = await prisma.product.findFirst({
    include: {
      images: {
        select: {
          key: true,
          url: true,
          hash: true,
        },
      },
    },
    where: {
      id: parseInt(id, 10),
      Store: {
        name: store,
      },
    },
  });

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
};

export default Page;