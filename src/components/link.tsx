import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Link as ChakraLink } from "@chakra-ui/react";

const Link = ({ isExternal, href, ...props }: any, ref: any) => {
  const Comp = props.as || ChakraLink;

  return (
    <NextLink href={href} passHref>
      <Comp {...props} ref={ref} />
    </NextLink>
  );
};

export default React.forwardRef(Link);
