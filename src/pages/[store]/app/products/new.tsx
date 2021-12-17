import {
  Box,
  Button,
  chakra,
  Checkbox,
  Container,
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
} from "@chakra-ui/react";
import { FilePicker } from "components/file-picker";
import { FormGroup } from "components/form-group";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import SelectMenu, { CreateableSelectMenu } from "components/select";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ArrowLeft } from "react-iconly";

const NewProduct: NextPage = () => {
  const router = useRouter();

  const [files, setFiles] = React.useState<any>([]);
  const [formValue, setFormValue] = React.useState({
    name: "",
  });

  return (
    <StoreDashboardLayout title="Add product">
      <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
        <Stack direction="row" justify="space-between" aling="center" mb={10}>
          <NextLink href={`/${router?.query.store}/app/products/`} passHref>
            <Stack as={Link} border="none" direction="row" alignItems="center">
              <ArrowLeft set="light" />

              <Heading as="h2" fontSize="lg" fontWeight="600">
                Add Product
              </Heading>
            </Stack>
          </NextLink>

          <Button variant="primary">Publish</Button>
        </Stack>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "8", md: "14" }}
        >
          <Stack w="full" flex={2} spacing={10}>
            <FormGroup id="name" label="Product Name">
              <Input
                isRequired
                type="text"
                placeholder="Hair growth oil"
                variant="outline"
                value={formValue.name}
                onChange={(e) =>
                  setFormValue({ ...formValue, name: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup id="media" label="Media">
              <FilePicker files={files} setFiles={setFiles} />
            </FormGroup>

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
                        <FormGroup id="price" label="Price">
                          <Input
                            isRequired
                            type="number"
                            placeholder="0.00"
                            variant="flushed"
                            value={formValue.name}
                            onChange={(e) =>
                              setFormValue({
                                ...formValue,
                                name: e.target.value,
                              })
                            }
                          />
                        </FormGroup>

                        <FormGroup id="discountPrice" label="Discount Price">
                          <Input
                            isRequired
                            type="number"
                            placeholder="0.00"
                            variant="flushed"
                            value={formValue.name}
                            onChange={(e) =>
                              setFormValue({
                                ...formValue,
                                name: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Stack>
                    </chakra.article>

                    <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                      <Heading fontSize="md" fontWeight="600" mb={6}>
                        Shipping
                      </Heading>

                      <Checkbox mb={6} defaultIsChecked>
                        This is a physical product
                      </Checkbox>

                      {/* this displays when checkbox is false */}
                      <Text fontSize="sm" color="rgb(0 0 0 / 62%)">
                        * Customers won&apos;t enter their shipping address or
                        choose a shipping method when buying this product.
                      </Text>
                    </chakra.article>

                    <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                      <Heading fontSize="md" fontWeight="600" mb={6}>
                        Variants
                      </Heading>

                      <Checkbox mb={8} defaultIsChecked>
                        This product has multiple options, like different sizes
                        or colors
                      </Checkbox>

                      <Stack
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align="flex-end"
                        spacing={5}
                        mb={6}
                      >
                        <Box flex={1}>
                          <FormGroup id="options" label="Option 1">
                            <SelectMenu
                              title="Choose Option"
                              placeholder="Choose"
                              variant="flushed"
                              value=""
                              size="sm"
                              onChange={() => null}
                              options={[
                                { value: "title", label: "Title" },
                                { value: "color", label: "Color" },
                                { value: "size", label: "Size" },
                                { value: "material", label: "Material" },
                                { value: "style", label: "Style" },
                              ]}
                            />
                          </FormGroup>
                        </Box>

                        <Box flex={2}>
                          <FormGroup id="discountPrice">
                            <Input
                              isRequired
                              placeholder="Seperate options with a comma"
                              variant="outline"
                              value={formValue.name}
                              onChange={(e) =>
                                setFormValue({
                                  ...formValue,
                                  name: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </Box>
                      </Stack>

                      <Button variant="solid-outline">
                        Add another option
                      </Button>
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
                    value="food"
                    size="md"
                    onChange={() => null}
                    options={[
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
                    value=""
                    onChange={() => null}
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

export default NewProduct;
