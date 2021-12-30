import React from "react";
import { chakra, Image, Stack, Center } from "@chakra-ui/react";

type FileGalleryProps = {
  images: any[];
  alt: string;
};

export function FileGallery(props: FileGalleryProps) {
  const [activeImage, setActiveImage] = React.useState(props.images[0].url);

  return (
    <Stack w="full" flex={1} spacing={4}>
      <chakra.section h={{ base: "sm", md: "xl" }} w="full" pos="relative">
        <Image
          src={activeImage}
          alt={props.alt ?? "product image"}
          objectFit="cover"
          w="full"
          height="full"
          cursor="pointer"
        />
      </chakra.section>

      <Stack direction="row" spacing={3}>
        {props.images.map((image: any, idx: number) => (
          <Center
            key={idx}
            boxSize="50px"
            cursor="pointer"
            p={activeImage === image.url ? 1 : undefined}
            border={
              activeImage === image.url
                ? "1px solid rgb(0 0 0 / 80%)"
                : undefined
            }
            onClick={() => setActiveImage(image.url)}
          >
            <Image
              src={image.url}
              alt={props.alt ?? "product image"}
              objectFit="cover"
              objectPosition="center 70%"
              boxSize="100%"
            />
          </Center>
        ))}
      </Stack>
    </Stack>
  );
}
