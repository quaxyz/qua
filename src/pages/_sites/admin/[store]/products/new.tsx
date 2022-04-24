import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "components/link";
import {
  Button,
  chakra,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { FilePicker } from "components/file-picker";
import { FormGroup } from "components/form-group";
import { CreateableSelectMenu } from "components/select";
import { ArrowLeft } from "react-iconly";
import { useMutation, useQueryClient } from "react-query";
import { withSsrSession } from "libs/session";
import { MdClose } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

const Variant = ({ type, options, setType, setOptions }: any) => {
  const addVariantModal = useDisclosure();

  const onOptionChange = (
    data: string,
    key: "option" | "price",
    idx: number
  ) => {
    const newOptions = [...options];

    const option = newOptions[idx];
    option[key] = data;

    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions(options.concat({ option: "", price: "" }));
  };

  const removeOption = (idx: number) => {
    setOptions(options.filter((_: any, i: number) => i !== idx));
  };

  return (
    <>
      <Button
        variant="primary-outline"
        spacing={1}
        rightIcon={<AiOutlineEdit />}
        onClick={addVariantModal.onOpen}
      >
        <Text textTransform="capitalize">
          {type || "Select Type"} - {options.length} Options
        </Text>
      </Button>

      <Modal
        isCentered
        isOpen={addVariantModal.isOpen}
        onClose={addVariantModal.onClose}
        size="md"
        scrollBehavior="inside"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton
            rounded="full"
            bg="rgba(0, 0, 0, 0.02)"
            fontSize="sm"
            top={4}
            right={5}
          />

          <ModalHeader align="flex-start" color="black" py={4}>
            Variant
          </ModalHeader>

          <ModalBody py={5}>
            <Stack spacing={5}>
              <FormGroup id="category" label="Type">
                <CreateableSelectMenu
                  title="Select Category"
                  placeholder="Select"
                  variant="outline"
                  size="md"
                  value={type}
                  onChange={(value) => setType(value)}
                  defaultOptions={[
                    { value: "color", label: "Color" },
                    { value: "size", label: "Size" },
                    { value: "style", label: "Style" },
                  ]}
                />
              </FormGroup>

              <chakra.section>
                <Stack spacing={2} mt={2} mb={4}>
                  <Stack direction="row" spacing={2}>
                    <Text
                      flex={1}
                      fontSize="xs"
                      textTransform="uppercase"
                      fontWeight="600"
                    >
                      Option
                    </Text>

                    <Text
                      flex={1}
                      pl={1}
                      fontSize="xs"
                      textTransform="uppercase"
                      fontWeight="600"
                    >
                      Price
                    </Text>

                    <chakra.div w="45px" />
                  </Stack>

                  {options.map((option: any, idx: number) => (
                    <Stack direction="row" spacing={2} key={idx}>
                      {/* value */}
                      <FormGroup id="option">
                        <Input
                          isRequired
                          fontSize="sm"
                          placeholder="eg: Red, 3 liters"
                          variant="outline"
                          value={option.option}
                          onChange={(e) =>
                            onOptionChange(e.target.value, "option", idx)
                          }
                        />
                      </FormGroup>

                      {/* price */}
                      <FormGroup id="price">
                        <Input
                          isRequired
                          fontSize="sm"
                          placeholder="0.00"
                          variant="outline"
                          value={option.price}
                          onChange={(e) =>
                            onOptionChange(e.target.value, "price", idx)
                          }
                        />
                      </FormGroup>

                      {/* remove button */}
                      <IconButton
                        aria-label="Remove option"
                        variant="ghost"
                        rounded="full"
                        icon={<MdClose />}
                        onClick={() => removeOption(idx)}
                      />
                    </Stack>
                  ))}
                </Stack>

                <Button
                  size="sm"
                  variant="solid-outline"
                  onClick={() => addOption()}
                >
                  Add Option
                </Button>
              </chakra.section>
            </Stack>
          </ModalBody>

          <ModalFooter justifyContent="flex-start">
            <Text fontSize="sm" fontStyle="italic" color="rgb(0 0 0 / 55%)">
              * Only add price if option price is different from base price
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Page = ({ categories }: any) => {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

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
      return Api().post(`/admin/${router.query.store}/products/new`, payload);
    },
    {
      onSuccess: async ({ payload: result }) => {
        await queryClient.invalidateQueries("store-dashboard-products");

        toast({
          title: "Product published",
          position: "top-right",
          status: "success",
        });

        router.push(`/${router.query.store}/products/${result.product.id}`);
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
    variants: state.variants.some(
      (v: any) =>
        v.type === "" ||
        v.options.length < 2 ||
        v.options.some((o: any) => o.option === "")
    ),
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

    addProductMutation.mutate(formValue);
  };

  return (
    <Container
      maxW="100%"
      py={{ base: "4", md: "12" }}
      px={{ base: "6", md: "16" }}
    >
      <Stack
        direction="row"
        justify="space-between"
        alignItems="center"
        mb={10}
      >
        <Link href={`/${router.query.store}/products`} border="none">
          <Stack border="none" direction="row" alignItems="center" spacing="1">
            <ArrowLeft set="light" />
            <Heading
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              color="#131415"
            >
              Add Product
            </Heading>
          </Stack>
        </Link>

        <Button
          variant="primary"
          colorScheme="black"
          onClick={onPublish}
          isLoading={addProductMutation.isLoading}
          size={useBreakpointValue({ base: "sm", md: "md" })}
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
            <FormErrorMessage>Title is required</FormErrorMessage>
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
              <TabPanel p="0" mt="4">
                <Stack spacing={4}>
                  <FormGroup id="description">
                    <Textarea
                      rows={8}
                      fontSize={{ base: "0.9375rem", md: "1rem" }}
                      placeholder="Enter product description..."
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
                </Stack>
              </TabPanel>

              <TabPanel p="0" mt="4">
                <Stack spacing={4}>
                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 8%)">
                    <Heading fontSize="md" fontWeight="600" mb={6}>
                      Shipping
                    </Heading>

                    <Checkbox
                      mb={4}
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
                        * Customers won&apos;t enter their shipping details when
                        buying this product.
                      </Text>
                    )}
                  </chakra.article>

                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 8%)">
                    <Heading fontSize="md" fontWeight="600" mb={6}>
                      Stock
                    </Heading>

                    <Checkbox
                      mb={4}
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

                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 8%)">
                    <Heading fontSize="md" fontWeight="600" mb={2}>
                      Variants
                    </Heading>

                    <Text color="rgb(0 0 0 / 65%)" mb={6}>
                      Add multiple options, like different sizes or colors
                    </Text>

                    <Stack direction="row" spacing={4}>
                      {formValue.variants.map((variant, idx) => (
                        <Variant
                          key={idx}
                          type={variant.type}
                          options={variant.options}
                          setType={(value: string) => {
                            const newVariants = [...formValue.variants];
                            newVariants[idx].type = value;

                            setFormValue({
                              ...formValue,
                              variants: newVariants,
                            });
                          }}
                          setOptions={(options: any) => {
                            const newVariants = [...formValue.variants];
                            newVariants[idx].options = options;

                            setFormValue({
                              ...formValue,
                              variants: newVariants,
                            });
                          }}
                        />
                      ))}
                    </Stack>

                    {errors.variants && (
                      <Text mt={2} color="red.400" fontSize="sm">
                        Invalid variant: Variant type is required and each
                        variant must have 2 options
                      </Text>
                    )}

                    <Button
                      mt={4}
                      variant="solid-outline"
                      onClick={() => {
                        setFormValue({
                          ...formValue,
                          variants: formValue.variants.concat({
                            type: "",
                            options: [],
                          }),
                        });
                      }}
                    >
                      Add variant
                    </Button>
                  </chakra.article>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>

        <Stack w="full" flex={1} spacing={5}>
          {/* pricing */}
          <Stack border="1px solid rgb(0 0 0 / 8%)">
            <chakra.article p={4} border="1px solid rgb(0 0 0 / 8%)">
              <Heading fontSize="lg" mb={4}>
                Pricing
              </Heading>

              <Stack direction="row" justify="space-between" spacing={6}>
                <FormControl id="price" isInvalid={errors.price}>
                  <FormLabel htmlFor="price">Price</FormLabel>
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

          {/* category */}
          <Stack
            divider={<StackDivider borderColor="rgb(0 0 0 / 8%)" />}
            border="1px solid rgb(0 0 0 / 8%)"
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

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async ({ params, req }) => {
    if (!req.session.data) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const storeName = params?.store as string;
    if (!storeName) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const store = await prisma.store.findFirst({
      where: {
        name: storeName,
        owner: {
          id: req.session.data.userId,
        },
      },
      select: {
        name: true,
      },
    });
    if (!store) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const allProducts = await prisma.product.findMany({
      distinct: ["category"],
      where: {
        Store: { name: store.name },
      },
      select: {
        category: true,
      },
    });
    const categories = (allProducts || [])
      .map((p) => p.category)
      .filter(Boolean);

    return {
      props: {
        categories,
        layoutProps: {
          title: `Add Product - ${store.name}`,
        },
      },
    };
  }
);

Page.Layout = StoreDashboardLayout;
export default Page;
