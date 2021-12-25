import {
  Box,
  Button,
  Container,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Plus, Search } from "react-iconly";
import { FiMoreHorizontal } from "react-icons/fi";

const img = `https://images.unsplash.com/photo-1640195516488-1fb03e574057?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60`;

interface IProductCard {
  imageUrl?: string;
  description?: string;
  price?: string;
  inStock?: string;
  sold?: string;
  id?: string;
}

const ProductCardMobile = (props: IProductCard) => {
  return (
    <Stack
      direction="row"
      display={{ base: "flex", md: "none" }}
      border="0.5px solid rgba(0, 0, 0, 0.12)"
      p="8px"
      mt="12px"
    >
      <Box w="100%" maxW="100px" minW="80px">
        <Image
          src={props.imageUrl ?? img}
          alt="Add Icon"
          layout="fixed"
          w={{ base: "20", md: "100" }}
          h={{ base: "20", md: "100" }}
          mb="1"
        />
      </Box>
      <Box w="100%">
        <Text fontSize="14px" fontWeight="400" lineHeight="16.94px" pb="4px">
          {props.description ??
            `WD 16TB Elements Desktop Hard Drive HDD, USB 3.0, Compatible with PC,
          Mac, PS4 & Xbox - WDBWLG0160HBK-NESN`}
        </Text>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            Price:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            {props.price ? `$${props.price}` : `$200`}
          </Text>
        </Stack>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            In stock:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            {props.inStock ?? `20`}
          </Text>
        </Stack>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            sold:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            {props.sold ?? `65`}
          </Text>
        </Stack>
      </Box>
      <Box maxW="50px">
        <Button variant="primary-outline" border="none">
          <FiMoreHorizontal />
        </Button>
      </Box>
    </Stack>
  );
};

const ProductCardDesktop = (props: IProductCard) => {
  const router = useRouter();
  return (
    <Tr border="0.5px solid rgba(0, 0, 0, 0.12)" p="8px" mt="12px">
      <Td
        display="flex"
        justifyContent="start"
        maxW="430px"
        alignItems="center"
      >
        <Box w="100%" maxW="100px">
          <Image
            src={props.imageUrl}
            alt="Add Icon"
            layout="fixed"
            w="100%"
            h="100%"
            maxH="100px"
            maxW="100px"
            minH="60px"
            minW="60px"
            mb="1"
          />
        </Box>
        <Text pl="12px" fontWeight="300" fontSize="14px" lineHeight="16.94px">
          {props.description ??
            `WD 16TB Elements Desktop Hard Drive HDD, USB 3.0, Compatible with PC,
          Mac, PS4 & Xbox - WDBWLG0160HBK-NESN`}
        </Text>
      </Td>
      <Td>$ {props.price ?? `24`}</Td>
      <Td isNumeric>{props.inStock ?? `20`}</Td>
      <Td isNumeric>{props.sold ?? `65`}</Td>
      <Td>
        <Button variant="primary-outline" border="none">
          <FiMoreHorizontal />
        </Button>
      </Td>
    </Tr>
  );
};

const ProductGrid = () => {
  return (
    <Box pb="3rem">
      <Box display={{ base: "block", md: "none" }}>
        {[1, 2, 3].map((index) => (
          <ProductCardMobile key={index} imageUrl={img} />
        ))}
      </Box>
      <Box display={{ base: "none", md: "block" }}>
        <Table style={{ borderSpacing: "12px 0" }}>
          <Thead>
            <Tr>
              <Th>Product Name</Th>
              <Th>Price</Th>
              <Th isNumeric>in stock</Th>
              <Th isNumeric>sold</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody fontWeight="400" fontSize="15px" lineHeight="16.94px">
            {[1, 2, 3].map((index) => (
              <ProductCardDesktop key={index} imageUrl={img} />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
const Products = () => {
  const router = useRouter();
  const isProductList = true;
  return (
    <StoreDashboardLayout title="Products">
      <Container maxW="100%" py={8} px={{ base: "4", md: "12" }}>
        <Stack direction="row" justify="space-between">
          <Heading as="h2" fontSize="24px" fontWeight="500" color="#000">
            Products
          </Heading>

          <NextLink href={`/${router?.query.store}/app/products/new`} passHref>
            <Button variant="primary">
              <Plus
                set="bold"
                primaryColor="#ffffff"
                style={{ marginRight: "14px" }}
              />
              New Product
            </Button>
          </NextLink>
        </Stack>

        {isProductList ? (
          <>
            <Box maxW="403px" pt="5px" pb={{ base: "28px", md: "45px" }}>
              <InputGroup>
                <InputLeftElement
                  fontSize="1rem"
                  pointerEvents="none"
                  // eslint-disable-next-line react/no-children-prop
                  children={
                    <Icon
                      boxSize="10px"
                      as={() => <Search set="light" primaryColor="#0E0F0F" />}
                    />
                  }
                />
                <Input
                  type="text"
                  color="rgba(180, 182, 184, 1)"
                  placeholder="Search"
                />
              </InputGroup>
            </Box>
            <ProductGrid />
          </>
        ) : (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={{ base: "8rem", md: "20rem" }}
          >
            <Image
              src="/svg/add.svg"
              alt="Add Icon"
              layout="fixed"
              w={{ base: "20", md: "100" }}
              h={{ base: "20", md: "100" }}
              mb="4"
            />
            <Stack alignItems="center" textAlign="center" justify="center">
              <Text fontSize="xl" fontWeight="bold" color="#000">
                Add and manage your products
              </Text>
              <Text fontSize="lg">
                You can add products and manage your pricing here.
              </Text>
            </Stack>
          </Stack>
        )}
      </Container>
    </StoreDashboardLayout>
  );
};

export default Products;
