import {
  chakra,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import { Wallet } from 'components/wallet'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Bag, Category, Graph } from 'react-iconly'
import { CgMore } from 'react-icons/cg'

const navLinks = [
  {
    name: 'Dashboard',
    icon: (props: any) => <Category set="light" {...props} />,
    url: '/dashboard'
  },
  {
    name: 'Products',
    icon: (props: any) => <Graph set="light" {...props} />,
    url: '/products'
  },
  {
    name: 'Orders',
    icon: (props: any) => <Bag set="light" {...props} />,
    url: '/orders'
  }
]

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter()
  return (
    <Grid
      templateColumns="280px 1fr"
      templateRows="70px 1fr 70px"
      templateAreas={{
        base: `"topbar topbar" "main main" "bottombar bottombar"`,
        md: `"sidebar main" "sidebar main" "sidebar main"`
      }}
      minH="100vh"
    >
      <chakra.aside
        gridArea="sidebar"
        bg="#000000"
        position="fixed"
        left="0"
        height="100vh"
        px={8}
        py={8}
        display={{ base: 'none', md: 'block' }}
      >
        <Stack spacing={8} minH="100%">
          <Heading fontWeight="800" fontSize="2xl" color="#fff" px={3}>
            Frowth
          </Heading>

          <Stack spacing={6}>
            {navLinks.map((navLink, idx) => (
              <NextLink
                key={idx}
                href={`/${router.query?.store}/app${navLink.url}`}
                passHref
              >
                <Link
                  px={3}
                  py={3}
                  rounded="4px"
                  borderBottom="none"
                  _hover={{ transform: 'scale(1.05)' }}
                  {...(router.asPath.includes(navLink.url)
                    ? { color: '#000', bg: '#FFF' }
                    : { color: '#FFF' })}
                >
                  <Stack direction="row" spacing={4} align="center">
                    <Icon boxSize={5} as={navLink.icon} />
                    <Text
                      fontWeight="normal"
                      color="inherit"
                      fontSize="inherit"
                      as="span"
                    >
                      {navLink.name}
                    </Text>
                  </Stack>
                </Link>
              </NextLink>
            ))}
          </Stack>

          <Wallet
            ButtonProps={{
              variant: 'outline',
              mt: 'auto !important',
              color: '#FFF',
              rounded: '8px',
              borderColor: 'rgb(255 255 255 / 16%)',
              leftIcon: <Icon as={CgMore} mr={3} />,
              _hover: {
                bg: 'transparent',
                borderColor: 'rgb(255 255 255 / 48%)'
              }
            }}
          />
        </Stack>
      </chakra.aside>

      <chakra.header
        gridArea="topbar"
        bg="#000000"
        px={5}
        display={{ base: 'block', md: 'none' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justify="space-between"
          h="100%"
          w="100%"
        >
          <Heading fontWeight="800" fontSize="xl" color="#fff">
            Frowth
          </Heading>

          <Wallet
            ButtonProps={{
              variant: 'outline',
              color: '#FFF',
              rounded: '8px',
              size: 'sm',
              borderColor: 'rgb(255 255 255 / 16%)',
              rightIcon: <Icon as={CgMore} />,
              _hover: {
                bg: 'transparent',
                borderColor: 'rgb(255 255 255 / 48%)'
              }
            }}
          />
        </Stack>
      </chakra.header>

      <chakra.main gridArea="main">{children}</chakra.main>

      <chakra.aside
        gridArea="bottombar"
        bg="#000000"
        display={{ base: 'block', md: 'none' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justify="space-around"
          h="100%"
          w="100%"
        >
          {navLinks.map((NavLink, idx) => (
            <NextLink
              key={idx}
              href={`/${router.query?.store}/app${NavLink.url}`}
              passHref
            >
              <Link
                borderBottom="none"
                color="#FFF"
                {...(router.asPath.includes(NavLink.url)
                  ? { textDecoration: 'underline' }
                  : {})}
              >
                <Stack spacing={2} align="center">
                  <Icon
                    boxSize={5}
                    as={(props) => (
                      <NavLink.icon
                        {...(router.asPath.includes(NavLink.url)
                          ? { set: 'bold' }
                          : {})}
                        {...props}
                      />
                    )}
                  />
                  <Text
                    fontWeight="normal"
                    color="inherit"
                    fontSize="xs"
                    as="span"
                  >
                    {NavLink.name}
                  </Text>
                </Stack>
              </Link>
            </NextLink>
          ))}
        </Stack>
      </chakra.aside>
    </Grid>
  )
}

export default DashboardLayout
