import React from "react";
import NextLink from "next/link";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import CustomerLayout from "components/layouts/customer-dashboard";
import {
  Button,
  chakra,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

const Shipping: NextPage = () => {
  const router = useRouter();

  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<any>({});
  const [formValue, setFormValue] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryType: "DOOR_DELIVERY",
    category: null as any,
  });

  return (
    <CustomerLayout title="Shipping">
      <chakra.main>
        <Container
          maxW={{ base: "100%", md: "container.lg" }}
          pb={20}
          borderLeft="0.5px solid rgba(0, 0, 0, 8%)"
          borderRight="0.5px solid rgba(0, 0, 0, 8%)"
          centerContent
        >
          <Stack
            w="100%"
            px={{ base: "2", md: "24" }}
            overflowY="scroll"
            pb={{ base: "12", md: "0" }}
          >
            <chakra.form>
              <chakra.header pt={{ base: "8", md: "16" }}>
                <Heading
                  as="h2"
                  fontSize={{ base: "lg", md: "1xl" }}
                  color="#000"
                >
                  Shipping Details
                </Heading>
              </chakra.header>
              <Stack py={12} spacing={12}>
                <FormControl id="name" isInvalid={errors.name} isRequired>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="James Bond"
                    variant="flushed"
                    disabled={saving}
                    value={formValue.name}
                    onChange={(e) =>
                      setFormValue({ ...formValue, name: e.target.value })
                    }
                  />
                  <FormErrorMessage>Name is required</FormErrorMessage>
                </FormControl>

                <FormControl id="email" isInvalid={errors.email} isRequired>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="james007@emails.com"
                    variant="flushed"
                    disabled={saving}
                    value={formValue.email}
                    onChange={(e) =>
                      setFormValue({ ...formValue, email: e.target.value })
                    }
                  />
                  <FormErrorMessage>Email is required</FormErrorMessage>
                </FormControl>

                <FormControl id="phone" isInvalid={errors.email} isRequired>
                  <FormLabel htmlFor="phone">Phone number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="888 888 8888"
                    variant="flushed"
                    disabled={saving}
                    value={formValue.phone}
                    onChange={(e) =>
                      setFormValue({ ...formValue, phone: e.target.value })
                    }
                  />
                  <FormErrorMessage>Phone is required</FormErrorMessage>
                </FormControl>

                <FormControl id="address" isInvalid={errors.email} isRequired>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Input
                    type="text"
                    placeholder="Address"
                    variant="flushed"
                    disabled={saving}
                    value={formValue.address}
                    onChange={(e) =>
                      setFormValue({ ...formValue, address: e.target.value })
                    }
                  />
                  <FormErrorMessage>Address is required</FormErrorMessage>
                </FormControl>

                <Checkbox size="lg" mb={6} defaultChecked>
                  Save details for next time
                </Checkbox>

                <Stack pb="">
                  <Heading
                    as="h2"
                    py={{ base: "4", md: "4" }}
                    fontSize={{ base: "lg", md: "1xl" }}
                    color="#000"
                  >
                    Delivery Method
                  </Heading>

                  <RadioGroup
                    onChange={(value) =>
                      setFormValue({ ...formValue, deliveryType: value })
                    }
                    value={formValue.deliveryType}
                  >
                    <Stack spacing={{ base: "4", md: "6" }}>
                      <Radio size="lg" value="DOOR_DELIVERY">
                        Door Delivery
                      </Radio>
                      <Radio size="lg" value="PICKUP">
                        Contact seller for pickup
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Stack>

                <Stack direction="row" justify="space-between" py={2}>
                  <Stack direction="column" spacing={4}>
                    <Text>Subtotal</Text>
                    <Text>Network Fee</Text>
                    <Text>Total</Text>
                  </Stack>
                  <Stack direction="column" spacing={4}>
                    <Text>:</Text>
                    <Text>:</Text>
                    <Text>:</Text>
                  </Stack>
                  <Stack direction="column" fontWeight="bold" spacing={4}>
                    <Text>$200</Text>
                    <Text>$1</Text>
                    <Text>$201</Text>
                  </Stack>
                </Stack>

                <NextLink href={`/${router?.query.store}/payment`} passHref>
                  <Button size="lg" variant="solid" width="100%">
                    Proceed to Payment
                  </Button>
                </NextLink>
              </Stack>
            </chakra.form>
          </Stack>
        </Container>
      </chakra.main>
    </CustomerLayout>
  );
};

export default Shipping;
