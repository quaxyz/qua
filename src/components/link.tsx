import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Link as ChakraLink } from "@chakra-ui/react";

const Link = ({ isExternal, href, ...props }: any) => {
  const { query } = useRouter();
  const Comp = props.as || ChakraLink;

  const path = `${href.charAt(0) !== "/" ? "/" : ""}${href}`;

  return (
    <NextLink href={isExternal ? href : `/${query?.store}${path}`} passHref>
      <Comp {...props} />
    </NextLink>
  );
};

export default Link;
