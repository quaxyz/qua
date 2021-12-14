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
import { CreateableSelectMenu } from "components/select";
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
      <Container maxW="100%" py={8} px={12}>
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

        <Stack direction="row" spacing={14}>
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
                      <Stack
                        direction="row"
                        justify="space-between"
                        align="center"
                        spacing={6}
                        mb={6}
                      >
                        <Heading fontSize="md" fontWeight="600">
                          Shipping
                        </Heading>
                        <Button variant="outline">Edit Locations</Button>
                      </Stack>
                      <Checkbox colorScheme="blue" size="lg" mb={4}>
                        This is a physical product
                      </Checkbox>
                      <Text>
                        {/* this displays when checkbox is false */}
                        Customers won&apos;t enter their shipping address or
                        choose a shipping method when buying this product.
                      </Text>

                      {/* this displays when checkbox is true */}
                      {/* <Stack
                        divider={<StackDivider borderColor="gray.200" />}
                        spacing={2}
                      >
                        <Stack
                          direction="row"
                          justify="space-between"
                          spacing={6}
                        >
                          <Heading
                            as="h5"
                            textTransform="uppercase"
                            fontSize="sm"
                          >
                            Pickup Stores
                          </Heading>
                          <Text fontSize="sm" textTransform="uppercase">
                            In stock
                          </Text>
                        </Stack>

                        <Stack>
                          <Text fontSize="lg" fontWeight="600">
                            Store Name
                          </Text>
                        </Stack>
                      </Stack> */}
                    </chakra.article>

                    <chakra.article p={4} border="1px solid rgb(0 0 0 / 16%)">
                      <Heading fontSize="md" fontWeight="600" mb={6}>
                        Properties
                      </Heading>

                      <Checkbox
                        colorScheme="blue"
                        size="lg"
                        mb={4}
                        defaultIsChecked
                      >
                        This product has multiple options, like different sizes
                        or colors
                      </Checkbox>

                      {/* this displays when checkbox is true */}
                      <Box>
                        <Stack
                          direction="row"
                          justify="space-between"
                          align="center"
                          spacing={2}
                        >
                          <FormGroup id="options" label="Option 1">
                            <CreateableSelectMenu
                              title="Choose Option"
                              placeholder="Choose"
                              variant="flushed"
                              value="size"
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

                          <FormGroup id="discountPrice">
                            <Input
                              isRequired
                              w="548px"
                              mb="-2rem"
                              type="number"
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
                        </Stack>
                        <Button variant="outline" mt={4}>
                          Add another option
                        </Button>
                      </Box>
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

      {/* <chakra.aside px="4rem" maxW="824">
          <FormGroup id="name" label="Title">
            <Input
              isRequired
              type="text"
              pl="4"
              placeholder="Olive hair oil"
              value={formValue.name}
              onChange={(e) =>
                setFormValue({ ...formValue, name: e.target.value })
              }
            />
          </FormGroup>
          <Spacer my="8" />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="448"
            background="linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04))"
            border="1px solid rgba(0, 0, 0, 0.12)"
          >
            <FormGroup id="file">
              <Input isRequired type="file" />
            </FormGroup>
          </Box>
          <Spacer my="8" />

          <Tabs>
            <TabList>
              <Tab>Description</Tab>
              <Tab>Details</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Textarea
                  //   value={value}
                  //   onChange={handleInputChange}
                  placeholder="Tell customers more about this product..."
                  size="md"
                  borderRadius="0"
                  height="248"
                />
              </TabPanel>
              <TabPanel>
                <Box border="0.5px solid rgb(0 0 0 / 12%)" p="4">
                  <Heading as="h4" fontSize="lg">
                    Pricing
                  </Heading>
                  <Flex>
                    <FormGroup id="number" label="PRICE">
                      <Input
                        isRequired
                        type="number"
                        pl="4"
                        placeholder="$&nbsp;0.00"
                        value={formValue.name}
                        onChange={(e) =>
                          setFormValue({ ...formValue, name: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup id="number" label="DISCOUNT PRICE">
                      <Input
                        isRequired
                        type="number"
                        pl="4"
                        placeholder="$&nbsp;0.00"
                        value={formValue.name}
                        onChange={(e) =>
                          setFormValue({ ...formValue, name: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Flex>
                </Box>
                <Spacer my="8" />
                <Box border="0.5px solid rgb(0 0 0 / 12%)" p="4">
                  <Heading as="h4" fontSize="lg">
                    Shipping
                  </Heading>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </chakra.aside> */}
    </StoreDashboardLayout>
  );
};

export default NewProduct;
