import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import type { GetServerSideProps, GetStaticProps } from "next";
import { getStorePaths } from "libs/store-paths";
import { useRouter } from "next/router";
import Link from "components/link";
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
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { FilePicker } from "components/file-picker";
import { FormGroup } from "components/form-group";
import { CreateableSelectMenu } from "components/select";
import { ArrowLeft } from "react-iconly";
import { useMutation, useQueryClient } from "react-query";

const Variants = (props: { onChange: (variants: any[]) => void }) => {
  const [variants, setVariants] = React.useState([{ type: "", options: "" }]);

  const onVariantChange = (data: any, variantIdx: number) => {
    setVariants(
      variants.map((variant, idx) => {
        if (idx === variantIdx) return data;
        return variant;
      })
    );

    props.onChange(variants);
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

const Page = ({ categories }: any) => {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [hasVariant, setHasVariant] = React.useState(false);
  const [isLimited, setIsLimited] = React.useState(false);

  const [errors, setErrors] = React.useState<any>({});
  const [formValue, setFormValue] = React.useState({
    name: "",
    description: "",
    images: [] as File[],
    price: "",
    discountPrice: "",
    stock: "",
    physical: false,
    category: "",
    tags: "",
    variants: [] as any[],
  });

  const addProductMutation = useMutation(
    async (payload: any) => {
      return Api().post(`/dashboard/products/new`, payload);
    },
    {
      onSuccess: async ({ payload: result }) => {
        await queryClient.invalidateQueries("store-dashboard-products");

        router.push({
          pathname: `/_store/[store]/dashboard/products/[id]`,
          query: { store: router.query.store, id: result.product.id },
        });
      },
      onError: (err: any) => {
        toast({
          title: "Error saving product",
          description: err?.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  const checkForErrors = (state: any) => ({
    name: !state.name || state.name.length < 1,
    price: !state.price || state.price.length < 1,
    images: !state.images || state.images.length < 1 || state.images.length > 8,
  });

  const onPublish = async () => {
    // verify input
    const formErrors: any = checkForErrors(formValue);

    const formHasError = Object.keys(formErrors).filter(
      (field) => formErrors[field]
    ).length;

    if (formHasError) {
      setErrors({ ...formErrors });
      return;
    }

    addProductMutation.mutate({
      ...formValue,
    });
  };

  return (
    <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
      <Stack direction="row" justify="space-between" align="center" mb={10}>
        <Stack
          as={Link}
          href="/dashboard/products/"
          border="none"
          direction="row"
          alignItems="center"
        >
          <ArrowLeft set="light" />

          <Heading as="h2" fontSize="lg" fontWeight="600">
            All Products
          </Heading>
        </Stack>

        <Button
          variant="primary"
          colorScheme="black"
          onClick={onPublish}
          isLoading={addProductMutation.isLoading}
        >
          Publish
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
              placeholder="Enter Title"
              variant="outline"
              disabled={addProductMutation.isLoading}
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
              disabled={addProductMutation.isLoading}
              maxFiles={8}
              setFiles={(images) => {
                setFormValue({ ...formValue, images });
              }}
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
                <Stack spacing={4}>
                  <FormGroup id="description">
                    <Textarea
                      rows={8}
                      fontSize={{ base: "0.9375rem", md: "1rem" }}
                      placeholder="Tell customers more about the product..."
                      disabled={addProductMutation.isLoading}
                      value={formValue.description}
                      onChange={(e) =>
                        setFormValue({
                          ...formValue,
                          description: e.target.value,
                        })
                      }
                    />
                  </FormGroup>

                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                    <Heading fontSize="md" fontWeight="600" mb={6}>
                      Pricing
                    </Heading>

                    <Stack direction="row" justify="space-between" spacing={6}>
                      <FormControl id="price" isInvalid={errors.price}>
                        <FormLabel htmlFor="price">Price ($)</FormLabel>
                        <Input
                          isRequired
                          type="number"
                          placeholder="0.00"
                          variant="flushed"
                          disabled={addProductMutation.isLoading}
                          value={formValue.price}
                          // @ts-ignore
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) =>
                            setFormValue({
                              ...formValue,
                              price: e.target.value,
                            })
                          }
                        />
                        <FormErrorMessage>Price is required</FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </chakra.article>
                </Stack>
              </TabPanel>

              <TabPanel>
                <Stack spacing={4}>
                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                    <Heading fontSize="md" fontWeight="600" mb={6}>
                      Stock
                    </Heading>

                    <Checkbox
                      mb={6}
                      disabled={addProductMutation.isLoading}
                      checked={isLimited}
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
                            disabled={addProductMutation.isLoading}
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
                      disabled={addProductMutation.isLoading}
                      checked={formValue.physical}
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

                  {/* <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                    <Heading fontSize="md" fontWeight="600" mb={6}>
                      Variants
                    </Heading>

                    <Checkbox
                      mb={8}
                      disabled={saving}
                      checked={hasVariant}
                      onChange={(e) => setHasVariant(e.target.checked)}
                    >
                      This product has multiple options, like different sizes or
                      colors
                    </Checkbox>

                    {hasVariant && (
                      <Variants
                        onChange={(variants) =>
                          setFormValue({ ...formValue, variants })
                        }
                      />
                    )}
                  </chakra.article> */}
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
                  disabled={addProductMutation.isLoading}
                  value={formValue.category}
                  onChange={(value) =>
                    setFormValue({ ...formValue, category: value })
                  }
                  defaultOptions={categories.map((category: string) => ({
                    label: category,
                    value: category,
                  }))}
                />
              </FormGroup>
            </chakra.article>

            <chakra.article p={4}>
              <FormGroup id="tag" label="Tags" labelProps={{ fontSize: "sm" }}>
                <Input
                  placeholder="Vintage, cotton, summer"
                  disabled={addProductMutation.isLoading}
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
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const store = params?.store as string;
  const allProducts = await prisma.product.findMany({
    distinct: ["category"],
    where: {
      Store: { name: store },
    },
    select: {
      category: true,
    },
  });
  const categories = (allProducts || []).map((p) => p.category).filter(Boolean);

  return {
    props: {
      categories,
      layoutProps: {
        title: "Add Product",
      },
    },
  };
};

Page.Layout = StoreDashboardLayout;
export default Page;
