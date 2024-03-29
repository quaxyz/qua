import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "components/link";
import _capitalize from "lodash.capitalize";
import { customerAreaTheme } from "theme";
import { useCartStore } from "hooks/useCart";
import {
  Button,
  Center,
  chakra,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { CartContext } from "contexts/cart";
import { useRouter } from "next/router";
import { formatCurrency } from "libs/currency";
import { CartModal } from "components/cart-modal";

const CustomerLayout = ({
  title,
  description,
  store,
  hideOrderBtn,
  children,
}: any) => {
  const router = useRouter();
  const cartStore = useCartStore();

  return (
    <ChakraProvider theme={customerAreaTheme}>
      <CartContext.Provider value={cartStore}>
        <Head>
          <title>
            {title
              .split(" ")
              .map((w: string) => _capitalize(w))
              .join(" ")}
          </title>
          <meta name="description" content={description} />
        </Head>

        <Grid
          templateColumns="1fr"
          templateRows="60px 1fr 70px"
          templateAreas={{
            base: `"topbar topbar" "main main" "bottombar bottombar"`,
            md: `"topbar topbar" "main main" "main main"`,
          }}
          minH="100vh"
        >
          {/* topbar */}
          <chakra.nav
            gridArea="topbar"
            pos="fixed"
            top="0"
            zIndex="10"
            w="100%"
            bg="#fff"
            color="#000"
            px={16}
            py={4}
            alignItems="center"
            justifyContent="space-between"
            display={{ base: "none", md: "flex" }}
            borderBottom="1px solid rgba(0, 0, 0, 0.08)"
          >
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Link
                href="https://qua.xyz"
                borderBottom="none"
                display="inherit"
              >
                <Image
                  src="/svg/qua_mark_black.svg"
                  alt="Qua logo"
                  layout="fixed"
                  width={40}
                  height={40}
                />
              </Link>
              <Link
                href="/"
                borderBottom="none"
                _hover={{ transform: "scale(1.02)" }}
              >
                <Heading
                  as="h2"
                  fontWeight="700"
                  textTransform="capitalize"
                  fontSize="2xl"
                >
                  {store?.title || store?.name || router.query.store}
                </Heading>
              </Link>
            </Stack>

            <Stack direction="row" spacing={12} align="center">
              {!hideOrderBtn && cartStore.totalItems && (
                <CartModal store={store}>
                  <Button
                    variant="primary"
                    colorScheme="black"
                    h={14}
                    leftIcon={
                      <Center
                        bgColor="white"
                        color="#000"
                        rounded="full"
                        boxSize="25px"
                        p={2}
                        mr={2}
                      >
                        <Text fontSize="xs" lineHeight="1" color="inherit">
                          {cartStore.totalItems}
                        </Text>
                      </Center>
                    }
                    rightIcon={
                      <Text ml={2} fontSize="sm" lineHeight="1" color="inherit">
                        {formatCurrency(
                          cartStore.totalAmount || 0,
                          store.currency
                        )}
                      </Text>
                    }
                  >
                    View order
                  </Button>
                </CartModal>
              )}
            </Stack>
          </chakra.nav>

          {/* mobile topbar */}
          <chakra.header
            gridArea="topbar"
            w="100%"
            bg="#fff"
            color="#000"
            borderBottom="1px solid rgba(0, 0, 0, 0.08)"
            px={5}
            py={4}
            display={{ base: "block", md: "none" }}
          >
            <Stack direction="row" alignItems="center" h="100%" w="100%">
              <Link
                href="https://qua.xyz"
                borderBottom="none"
                display="inherit"
                ml="-4px !important"
              >
                <Image
                  src="/svg/qua_mark_black.svg"
                  alt="Qua logo"
                  layout="fixed"
                  width={35}
                  height={35}
                />
              </Link>

              <Link
                href="/"
                borderBottom="none"
                _hover={{ transform: "scale(1.05)" }}
              >
                <Heading
                  fontWeight="700"
                  textTransform="capitalize"
                  fontSize="xl"
                >
                  {store?.title || store?.name || router.query.store}
                </Heading>
              </Link>
            </Stack>
          </chakra.header>

          <chakra.main gridArea="main">{children}</chakra.main>

          {/* mobile bottombar */}
          {!hideOrderBtn && !!cartStore.totalItems && (
            <chakra.nav
              py={4}
              px={2}
              w="100%"
              bottom="0"
              pos="fixed"
              gridArea="bottombar"
              display={{ base: "block", md: "none" }}
            >
              <CartModal store={store}>
                <Button
                  size="sm"
                  isFullWidth
                  variant="primary"
                  colorScheme="black"
                  justifyContent="flex-start"
                  h={12}
                  leftIcon={
                    <Center
                      bgColor="white"
                      color="#000"
                      rounded="full"
                      boxSize="25px"
                      p={2}
                      mr={2}
                    >
                      <Text fontSize="xs" lineHeight="1" color="inherit">
                        {cartStore.totalItems}
                      </Text>
                    </Center>
                  }
                  rightIcon={
                    <Text ml={2} fontSize="sm" lineHeight="1" color="inherit">
                      {formatCurrency(cartStore.totalAmount, store.currency)}
                    </Text>
                  }
                >
                  <chakra.span flex="1" textAlign="left">
                    View order
                  </chakra.span>
                </Button>
              </CartModal>
            </chakra.nav>
          )}
        </Grid>
      </CartContext.Provider>
    </ChakraProvider>
  );
};

export default CustomerLayout;
