import React from "react";
import type { NextPage } from "next";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import NextLink from "next/link";
import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Input,
  Link,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { FormGroup } from "components/form-group";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-iconly";
import { FilePicker } from "components/file-picker";
import SelectMenu from "components/select";

const New: NextPage = () => {
  const router = useRouter();

  const [files, setFiles] = React.useState<any>([]);
  const [formValue, setFormValue] = React.useState({
    name: "",
  });

  return (
    <StoreDashboardLayout title="Add product">
      <Container maxW="100%" py={8} px={12}>
        <Stack direction="row" justify="space-between" mb={10}>
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
                  <SelectMenu
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

export default New;
