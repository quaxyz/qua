import React from "react";
import { useDisclosure } from "@chakra-ui/react";

export const Cart = ({ children }: any) => {
  const cartModal = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => cartModal.onOpen(),
      })}
    </>
  );
};
