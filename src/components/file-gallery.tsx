import React from "react";
import NextImage from "next/image";
import { chakra, Image, Stack, Center } from "@chakra-ui/react";

type FileGalleryProps = {
  images: any[];
  alt: string;
};

export function FileGallery(props: FileGalleryProps) {
  const [activeImage, setActiveImage] = React.useState(props.images[0].url);

  return (
    <Stack w="full" flex={1} spacing={4}>
      <chakra.section
        h={{ base: "sm", md: "xl" }}
        w="full"
        pos="relative"
        bg="gray.50"
      >
        <NextImage
          src={activeImage}
          alt={props.alt || "product image"}
          objectFit="contain"
          objectPosition="top"
          width="100%"
          height="100%"
          layout="responsive"
          priority
        />
      </chakra.section>

      <Stack direction="row" spacing={3}>
        {props.images.map((image: any, idx: number) => (
          <Center
            key={idx}
            boxSize="50px"
            cursor="pointer"
            pos="relative"
            p={activeImage === image.url ? 1 : undefined}
            border={
              activeImage === image.url
                ? "1px solid rgb(0 0 0 / 80%)"
                : undefined
            }
            onClick={() => setActiveImage(image.url)}
          >
            <NextImage
              src={image.url}
              alt={props.alt || "product image"}
              objectFit="cover"
              objectPosition="center 70%"
              width="50px"
              height="50px"
            />
          </Center>
        ))}
      </Stack>
    </Stack>
  );
}
