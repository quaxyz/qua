import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Link as ChakraLink } from "@chakra-ui/react";

const Link = ({ isExternal, href, ...props }: any) => {
  const router = useRouter();
  const Comp = props.as || ChakraLink;

  const pathPrefix =
    process.env.NODE_ENV !== "production" ? `_store/${router.query.store}` : ``;
  const path = `${pathPrefix}${href.charAt(0) !== "/" ? "/" : ""}${href}`;

  return (
    <NextLink href={isExternal ? href : `/${path}`} passHref>
      <Comp {...props} />
    </NextLink>
  );
};

export default Link;
