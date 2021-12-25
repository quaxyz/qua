import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";

const img = `https://images.unsplash.com/photo-1640195516488-1fb03e574057?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60`;

const ProductCardMobile = () => {
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
          src={img}
          // src="/images/orders.png"
          alt="Add Icon"
          layout="fixed"
          w={{ base: "20", md: "100" }}
          h={{ base: "20", md: "100" }}
          mb="1"
        />
      </Box>
      <Box w="100%">
        <Text fontSize="14px" fontWeight="400" lineHeight="16.94px" pb="4px">
          WD 16TB Elements Desktop Hard Drive HDD, USB 3.0, Compatible with PC,
          Mac, PS4 & Xbox - WDBWLG0160HBK-NESN
        </Text>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            Price:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            $200
          </Text>
        </Stack>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            In stock:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            20
          </Text>
        </Stack>
        <Stack direction="row" spacing="12px" pt="8px">
          <Text textTransform="capitalize" fontSize="12px" fontWeight="400">
            sold:
          </Text>
          <Text textTransform="capitalize" fontSize="12px" fontWeight="500">
            65
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

const ProductCardDesktop: React.FC<{ id: string | number }> = ({ id }) => {
  const router = useRouter();

  return (
    <Table>
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
        <Tr border="0.5px solid rgba(0, 0, 0, 0.12)" p="8px" mt="12px">
          <Td
            display="flex"
            justifyContent="start"
            maxW="430px"
            alignItems="center"
          >
            <Box w="100%" maxW="100px">
              <Image
                src="/images/orders.png"
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
            <Text
              pl="12px"
              fontWeight="300"
              fontSize="14px"
              lineHeight="16.94px"
            >
              WD 16TB Elements Desktop Hard Drive HDD, USB 3.0, Compatible with
              PC, Mac, PS4 & Xbox - WDBWLG0160HBK-NESN
            </Text>
          </Td>
          <Td>$24</Td>
          <Td isNumeric>20</Td>
          <Td isNumeric>65</Td>
          <Td>
            <Button variant="primary-outline" border="none">
              <FiMoreHorizontal />
            </Button>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
  // return (
  //   <Stack
  //     mb="1rem"
  //     direction="row"
  //     border="0.5px solid rgba(0, 0, 0, 0.12)"
  //     p="1.4rem"
  //     alignItems="center"
  //     textTransform="capitalize"
  //   >
  //     <Flex>
  //       <Box w="250px">
  //         <Image
  //           src="/images/orders.png"
  //           alt="Add Icon"
  //           layout="fixed"
  //           w="50px"
  //           h="50px"
  //           mb="1"
  //         />
  //       </Box>
  //       <NextLink href={`/${router.query?.store}/app/orders/${id}`}>
  //         <Link fontSize="16px" fontWeight={{ base: "400", md: "600" }}>
  //           WD 16TB Elements Desktop Hard Drive HDD, USB 3.0, Compatible with
  //           PC, Mac, PS4 & Xbox - WDBWLG0160HBK-NESN
  //         </Link>
  //       </NextLink>
  //     </Flex>
  //     <Flex w="100%" justifyContent="safe">
  //       <Text display={{ base: "inline-block", md: "none" }} pr="12px">
  //         Price
  //       </Text>
  //       <Text
  //         fontSize="14px"
  //         textAlign="right"
  //         fontWeight={{ base: "600", md: "600" }}
  //         mb={{ base: "2", md: "0" }}
  //       >
  //         $24
  //       </Text>
  //     </Flex>
  //     <Flex w="100%" justify="safe">
  //       <Text display={{ base: "inline-block", md: "none" }} pr="12px">
  //         In stock
  //       </Text>
  //       <Text
  //         fontSize="14px"
  //         fontWeight="500"
  //         bgColor="rgba(254, 238, 205, 1)"
  //         color="rgba(120, 81, 2, 1)"
  //         lineHeight="1.5"
  //         borderRadius="8px"
  //         px="12px"
  //         py="4px"
  //         textAlign="center"
  //       >
  //         20
  //       </Text>
  //     </Flex>
  //     <Flex w="100%" justify="safe">
  //       <Text display={{ base: "inline-block", md: "none" }} pr="12px">
  //         sold
  //       </Text>
  //       <Text
  //         fontSize="14px"
  //         fontWeight="500"
  //         bgColor="rgba(205, 254, 240, 1)"
  //         color="rgba(2, 120, 87, 1)"
  //         lineHeight="1.5"
  //         borderRadius="8px"
  //         px="12px"
  //         py="4px"
  //         textAlign="center"
  //       >
  //         65
  //       </Text>
  //     </Flex>
  //     <Flex w="100%" justify="space-between">
  //       <Text
  //         fontSize="14px"
  //         fontWeight="500"
  //         bgColor="rgba(205, 254, 240, 1)"
  //         color="rgba(2, 120, 87, 1)"
  //         lineHeight="1.5"
  //         borderRadius="8px"
  //         px="12px"
  //         py="4px"
  //         textAlign="center"
  //       >
  //         Paid
  //       </Text>
  //     </Flex>
  //   </Stack>
  // );
};

const ProductGrid = () => {
  return (
    <Box pb="3rem">
      {[1].map((index) => (
        <>
          <Box display={{ base: "block", md: "none" }} key={index}>
            <ProductCardMobile />
          </Box>
          <Box display={{ base: "none", md: "block" }} key={index}>
            <ProductCardDesktop id={index} />
          </Box>
        </>
      ))}
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
            <Button>New Product</Button>
          </NextLink>
        </Stack>

        {isProductList ? (
          <ProductGrid />
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
