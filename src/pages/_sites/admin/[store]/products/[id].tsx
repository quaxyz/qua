import React from "react";
import prisma from "libs/prisma";
import Api from "libs/api";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "components/link";
import StoreDashboardLayout from "components/layouts/store-dashboard";
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
import { FilePicker } from "components/file-picker";
import { FormGroup } from "components/form-group";
import { CreateableSelectMenu } from "components/select";
import { ArrowLeft } from "react-iconly";
import { useMutation, useQueryClient } from "react-query";
import { withSsrSession } from "libs/session";
import { AiOutlineEdit } from "react-icons/ai";
import { MdClose } from "react-icons/md";

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

const Page = ({ product, categories }: any) => {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

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
    variants: (product.variants || []) as any[],
  });

  const updateProductMutation = useMutation(
    async (payload: any) => {
      return Api().post(
        `/admin/${router.query.store}/products/${product.id}`,
        payload
      );
    },
    {
      onSuccess: async () => {
        toast({
          title: "Product updated",
          position: "top-right",
          status: "success",
        });

        await queryClient.invalidateQueries("store-dashboard-products");
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
    console.log(formErrors, formValue);

    const formHasError = Object.keys(formErrors).filter(
      (field) => formErrors[field]
    ).length;

    if (formHasError) {
      setErrors({ ...formErrors });
      return;
    }

    updateProductMutation.mutate(formValue);
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
              Edit Product
            </Heading>
          </Stack>
        </Link>

        <Stack direction="row">
          <Button
            variant="primary-outline"
            colorScheme="black"
            size={useBreakpointValue({ base: "sm", md: "md" })}
            as={Link}
            href={`/${router.query.store}/products/new`}
          >
            Add New
          </Button>

          <Button
            variant="primary"
            colorScheme="black"
            size={useBreakpointValue({ base: "sm", md: "md" })}
            onClick={onPublish}
            isLoading={updateProductMutation.isLoading}
          >
            Update
          </Button>
        </Stack>
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
              disabled={updateProductMutation.isLoading}
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
              disabled={updateProductMutation.isLoading}
              maxFiles={8}
              setFiles={(images) => setFormValue({ ...formValue, images })}
            />
            <FormErrorMessage>
              Each product needs at least 1 image and no more than 8 images
            </FormErrorMessage>
          </FormControl>

          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Description</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p="0" mt="4">
                <Stack spacing={4}>
                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                    <Heading fontSize="md" fontWeight="600" mb={6}>
                      Shipping
                    </Heading>

                    <Checkbox
                      mb={6}
                      disabled={updateProductMutation.isLoading}
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
                        * Customers won&apos;t enter their shipping details when
                        buying this product.
                      </Text>
                    )}
                  </chakra.article>

                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 12%)">
                    <Heading fontSize="md" fontWeight="600" mb={6}>
                      Stock
                    </Heading>

                    <Checkbox
                      mb={6}
                      disabled={updateProductMutation.isLoading}
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
                            disabled={updateProductMutation.isLoading}
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

                  <chakra.article p={4} border="1px solid rgb(0 0 0 / 12%)">
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
                      onClick={() => {
                        setFormValue({
                          ...formValue,
                          variants: formValue.variants.concat({
                            type: "",
                            options: [],
                          }),
                        });
                      }}
                      variant="solid-outline"
                    >
                      Add variant
                    </Button>
                  </chakra.article>
                </Stack>
              </TabPanel>

              <TabPanel p="0" mt="4">
                <Stack spacing={4}>
                  <FormGroup id="description">
                    <Textarea
                      rows={8}
                      fontSize={{ base: "0.9375rem", md: "1rem" }}
                      placeholder="Enter product description"
                      disabled={updateProductMutation.isLoading}
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
                    disabled={updateProductMutation.isLoading}
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
            border="1px solid rgb(0 0 0 / 16%)"
            mb={6}
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
                  disabled={updateProductMutation.isLoading}
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
                  disabled={updateProductMutation.isLoading}
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
        currency: true,
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

    const id = params?.id as string;
    if (!id) {
      return {
        notFound: true,
      };
    }

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
          name: store.name,
        },
      },
    });

    if (!product) {
      return {
        notFound: true,
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
        product: JSON.parse(JSON.stringify(product)),
        layoutProps: {
          title: `Edit Product - ${store.name}`,
        },
      },
    };
  }
);

Page.Layout = StoreDashboardLayout;
export default Page;
