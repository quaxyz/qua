import React from "react";
import prisma from "libs/prisma";
import Link from "components/link";
import Api from "libs/api";
import CustomerLayout from "components/layouts/customer-dashboard";
import { GetServerSideProps } from "next";
import {
  Container,
  Stack,
  chakra,
  Button,
  Heading,
  Image,
  Box,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { ArrowLeft } from "react-iconly";
import { format, parseJSON } from "date-fns";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatCurrency } from "libs/currency";

const Page = ({ order: initialOrder, orderProducts }: any) => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const cancelModal = useDisclosure();

  const cancelOrder = useMutation(
    async (payload: any) => {
      return Api().post(
        `/${router.query.store}/orders/${router.query.id}/cancel`,
        payload
      );
    },
    {
      onSuccess: async ({ payload: result }) => {
        await queryClient.setQueryData(["order", result.id], result);
        cancelModal.onClose();

        toast({
          title: "Order cancelled",
          description: "Your order has been cancelled",
          position: "top-right",
          status: "success",
        });
      },
      onError: (err: any) => {
        console.warn("Error cancelling order", err);

        toast({
          title: "Error cancelling order",
          description: err.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  const { data: order } = useQuery({
    queryKey: ["order", initialOrder.id],
    queryFn: async () => {},
    initialData: initialOrder,
    staleTime: Infinity,
  });

  return (
    <>
      <Container
        maxW={{ base: "100%", md: "container.xl" }}
        px={{ base: "4", md: "16" }}
      >
        <Link href={`/`} borderBottom="none" display="inline-block">
          <Stack
            direction="row"
            align="center"
            spacing={2}
            py={{ base: "4", md: "8" }}
          >
            <ArrowLeft set="light" />
            <chakra.span display="inline-block" fontSize="md" fontWeight="600">
              <Text>Back to store</Text>
            </chakra.span>
          </Stack>
        </Link>

        <chakra.section>
          <Stack
            direction="row"
            justify="space-between"
            spacing={{ base: "4", md: "8" }}
            pb={{ base: "none", md: "8" }}
            py={2}
            borderTop="1px dashed rgba(0, 0, 0, 12%)"
            borderBottom="1px dashed rgba(0, 0, 0, 12%)"
          >
            <Stack>
              <Text fontSize="sm">
                Order ID:{" "}
                <chakra.span fontWeight="bold">#{order.id}</chakra.span>
              </Text>
              <Text fontSize="sm">
                No. of items:{" "}
                <chakra.span fontWeight="bold">
                  {(order.items || []).length}{" "}
                  {(order.items || []).length === 1 ? "item" : "items"}
                </chakra.span>
              </Text>
              <Text fontSize="sm">
                Placed on:{" "}
                <chakra.span fontWeight="bold">
                  {format(parseJSON(order.createdAt), "dd.MM.yyyy")}
                </chakra.span>
              </Text>
              <Text fontSize="sm">
                Total:{" "}
                <chakra.span fontWeight="bold">
                  {formatCurrency(order.totalAmount)}
                </chakra.span>
              </Text>
              <Text fontSize="sm">
                Status:{" "}
                <chakra.span fontWeight="bold">{order.status}</chakra.span>
              </Text>
              <Text fontSize="sm">
                Paid With:{" "}
                <chakra.span fontWeight="bold">
                  {order.paymentMethod}
                </chakra.span>
              </Text>

              <Link
                color="green.500"
                fontSize={{ base: "xs", md: "sm" }}
                href="/about"
              >
                Contact for refunds or complaints
              </Link>
            </Stack>

            {order.status === "UNFULFILLED" && (
              <Button
                onClick={() => cancelModal.onOpen()}
                isLoading={cancelOrder.isLoading}
                variant="solid-outline"
              >
                Cancel Order
              </Button>
            )}
          </Stack>
        </chakra.section>

        <Heading
          as="h3"
          color="#000"
          py={{ base: "4", md: "6" }}
          fontSize={{ base: "lg", md: "1xl" }}
        >
          Items in your order
        </Heading>

        <Stack direction="column" w="100%" pb={2}>
          {orderProducts.map((itemDetail: any) => (
            <Stack
              key={itemDetail.productId}
              direction="row"
              w="100%"
              p={2}
              spacing={{ base: "2", md: "4" }}
              border="0.5px solid rgba(0, 0, 0, 12%)"
            >
              <Box>
                <Image
                  boxSize="100"
                  objectFit="cover"
                  src={itemDetail.image}
                  alt={itemDetail.name}
                />
              </Box>

              <Stack display="block" pt={{ base: "0", md: "2" }}>
                <Heading
                  as="h1"
                  fontSize={{ base: "md", md: "xl" }}
                  fontWeight="300"
                >
                  {itemDetail.name}
                </Heading>
                <chakra.span
                  display="block"
                  py="0.2rem"
                  fontSize={{ base: "xs", md: "sm" }}
                  textTransform="uppercase"
                >
                  QTY: {itemDetail.quantity}
                </chakra.span>
                <chakra.strong>${itemDetail.price}</chakra.strong>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Container>

      <Modal
        isCentered
        isOpen={cancelModal.isOpen}
        onClose={cancelModal.onClose}
      >
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={(e: any) => {
            e.preventDefault();

            cancelOrder.mutate({
              email: e.target["email"].value,
            });
          }}
        >
          <ModalHeader fontSize="lg" color="rgb(0 0 0 / 90%)">
            Cancel Order
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody color="rgb(0 0 0 / 70%)" py={5}>
            <Text>
              Please enter your email to confirm you want to cancel this order.
            </Text>

            <FormControl id="email" isRequired mt={5}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input type="email" variant="outline" isRequired />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="gray"
              mr={3}
              px={10}
              onClick={cancelModal.onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              colorScheme="black"
              px={10}
              isLoading={cancelOrder.isLoading}
            >
              Cancel Order
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.store || !params?.id) {
    return {
      notFound: true,
    };
  }

  const store = await prisma.store.findUnique({
    where: { name: params.store as string },
  });
  if (!store) {
    return {
      notFound: true,
    };
  }

  const order = await prisma.order.findFirst({
    where: { publicId: params.id as string, store: { id: store.id } },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      items: true,
      createdAt: true,
      totalAmount: true,
    },
  });
  if (!order) {
    return {
      notFound: true,
    };
  }

  const orderItems = order.items as any[];
  const orderItemIds = orderItems.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: orderItemIds } },
    select: {
      id: true,
      images: {
        select: {
          url: true,
        },
      },
    },
  });

  const orderProducts = orderItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      return {
        productId: product.id,
        quantity: item.quantity,
        name: item.name,
        image: product.images[0].url,
        price: item.price,
      };
    })
    .filter(Boolean);

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
      orderProducts: JSON.parse(JSON.stringify(orderProducts)),
      layoutProps: {
        title: `Order #${order.id} - ${store.name}`,
      },
    },
  };
};

Page.Layout = CustomerLayout;
export default Page;
