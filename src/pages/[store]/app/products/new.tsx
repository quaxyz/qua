import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea
} from '@chakra-ui/react'
import StoreDashboardLayout from 'components/layouts/store-dashboard'
import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { ArrowLeft } from 'react-iconly'

type FormGroupProps = {
  id: string
  label?: string
  helperText?: string
  required?: boolean
  children: any
}

const FormGroup = ({
  id,
  label,
  helperText,
  required,
  children
}: FormGroupProps) => (
  <FormControl id={id} isRequired={required}>
    <FormLabel fontWeight="500">{label}</FormLabel>

    <Stack
      pr={3}
      alignItems="center"
      direction="row"
      border="1px solid rgb(0 0 0 / 24%)"
      _hover={{
        borderColor: 'rgb(0 0 0 / 60%)'
      }}
    >
      {React.cloneElement(children, {
        border: 'none',
        rounded: '0px',
        px: 0,
        py: 6,
        fontWeight: 500,
        fontSize: 'xl',
        flex: 1,
        _placeholder: {
          color: 'rgb(0 0 0 / 12%)'
        },
        _focus: {
          outline: 'none'
        }
      })}
    </Stack>

    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)

const New: NextPage = () => {
  const router = useRouter()

  const [formValue, setFormValue] = React.useState({
    name: ''
  })

  return (
    <StoreDashboardLayout>
      <Head>
        <title>Add product - Qua</title>
      </Head>
      <Container maxW="100%">
        <chakra.header>
          <Flex justify="space-between" py="8" px="4rem">
            <Flex alignItems="center">
              <NextLink href={`/${router?.query.store}/app/products/`} passHref>
                <ArrowLeft
                  set="light"
                  primaryColor="#000"
                  style={{ cursor: 'pointer' }}
                />
              </NextLink>
              <Heading
                as="h2"
                fontSize="xl"
                fontWeight="500"
                color="#000"
                pl="4"
              >
                Add Product
              </Heading>
            </Flex>
            <Button>Publish</Button>
          </Flex>
        </chakra.header>

        <chakra.aside px="4rem" maxW="824">
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
        </chakra.aside>
      </Container>
    </StoreDashboardLayout>
  )
}

export default New
