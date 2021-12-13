import {
  Box,
  Button,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import StoreDashboardLayout from "components/layouts/store-dashboard";
import { truncateAddress } from "libs/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { FiExternalLink } from "react-icons/fi";

const Settings = () => {
  const router = useRouter();
  const { account } = useWeb3React();

  return (
    <StoreDashboardLayout>
      <Head>
        <title>Settings - Frowth</title>
      </Head>

      <Box
        maxWidth="100%"
        height="50vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // we could fetch unsplash image here based on store category
        bgImage="linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),url('/images/ryan-plomp-jvoZ-Aux9aw-unsplash.jpg')"
        bgPosition="center center"
        bgRepeat="no-repeat"
        bgSize="cover"
        color="#fff"
      >
        <Box
          maxW="48rem"
          mb="8"
          justifyContent="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Text
            fontSize="md"
            textTransform="uppercase"
            fontWeight="800"
            letterSpacing="0.15px"
            color="#fff"
            background="rgba(255, 255, 255, 0.28)"
            py="2"
            px="4"
            mb="2"
            borderRadius="50"
            userSelect="none"
          >
            Fashion
          </Text>
          <Spacer my="2" />
          <Heading as="h2" size="4xl">
            <Editable defaultValue="Store Title">
              <EditablePreview />
              <EditableInput
                textAlign="center"
                transition=".2s"
                outline="0.5px solid"
                outlineColor="rgba(0, 0, 0, 0.80)"
                borderRadius="0"
              />
            </Editable>
          </Heading>
        </Box>
      </Box>
      <Flex
        justifyContent="flex-end"
        alignItems="center"
        width="100%"
        mt="-4rem"
        pr="2rem"
      >
        <Button borderRadius="4px">Upload image</Button>
      </Flex>
      <Spacer my="6rem" />

      <Container maxW="100%" px="4rem">
        <Text fontSize="xl" pb="2" pl="2">
          About
        </Text>
        <Textarea
          placeholder="Tell customers who you are..."
          size="md"
          borderRadius="0"
          height="248"
        />
        <Spacer my="4rem" />

        <Text
          fontSize="xl"
          textTransform="uppercase"
          fontWeight="bold"
          pb="2"
          pl="2"
        >
          Settings
        </Text>

        <HStack spacing="2.4rem" p="2" mt="2">
          <FormControl id="name">
            <FormLabel textTransform="uppercase">Store name</FormLabel>
            <Input
              transition=".2s"
              outline="0.5px solid"
              outlineColor="rgba(0, 0, 0, 0.80)"
              borderRadius="0"
              type="text"
              value="Frowth"
            />
            {/* <FormHelperText></FormHelperText> */}
          </FormControl>

          <FormControl id="text" isDisabled>
            <FormLabel textTransform="uppercase">Category</FormLabel>
            <Input borderRadius="0" type="text" value="Cosmetics" />
          </FormControl>
        </HStack>

        <HStack spacing="2.4rem" p="2" mt="2">
          <FormControl id="name">
            <FormLabel textTransform="uppercase">Bussiness Location</FormLabel>
            <Input
              transition=".2s"
              outline="0.5px solid"
              outlineColor="rgba(0, 0, 0, 0.80)"
              borderRadius="0"
              type="text"
              placeholder="Enter store address"
            />
            {/* <FormHelperText></FormHelperText> */}
          </FormControl>

          <FormControl id="name">
            <FormLabel textTransform="uppercase">Social Links</FormLabel>
            <HStack>
              <Input
                transition=".2s"
                outline="0.5px solid"
                outlineColor="rgba(0, 0, 0, 0.80)"
                borderRadius="0"
                type="text"
                placeholder="Add Link"
              />
              <Input
                transition=".2s"
                outline="0.5px solid"
                outlineColor="rgba(0, 0, 0, 0.80)"
                borderRadius="0"
                type="text"
                placeholder="Add Link"
              />
              <Input
                transition=".2s"
                outline="0.5px solid"
                outlineColor="rgba(0, 0, 0, 0.80)"
                borderRadius="0"
                type="text"
                placeholder="Add Link"
              />
            </HStack>
            {/* <FormHelperText></FormHelperText> */}
          </FormControl>
        </HStack>

        <Box spacing="2.4rem" p="2" mt="2">
          <Text fontSize="md" textTransform="uppercase" pb="2">
            Verified owner address
          </Text>
          <Button
            as={Link}
            href={`https://etherscan.io/address/${account}`}
            rightIcon={<FiExternalLink />}
            size="lg"
            variant="outline"
            w="300px"
            // isFullWidth
            isExternal
          >
            {truncateAddress(account || "", 4)}
          </Button>
        </Box>
        <HStack spacing="2.4rem" p="2" my="4">
          <Button size="lg">Save Changes</Button>
        </HStack>
      </Container>
    </StoreDashboardLayout>
  );
};

export default Settings;
