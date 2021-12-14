import {
  Button,
  Center,
  chakra,
  Icon,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Delete } from "react-iconly";
import { HiUpload } from "react-icons/hi";
import { useUnmount } from "react-use";

type FilePickerProps = {
  files: any[];
  setFiles: (value: any) => void;
};

export const FilePicker = ({ files, setFiles }: FilePickerProps) => {
  const [activeImage, setActiveImage] = useState<any>(null);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/*",
    maxFiles: 8,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setActiveImage(newFiles[0]);
      setFiles(files.concat(...newFiles));
    },
  });

  const removeImage = (file: any) => {
    const newFiles = files.filter((f: any) => f !== file);
    URL.revokeObjectURL(file.preview);

    setActiveImage(newFiles[newFiles.length - 1]);
    setFiles(newFiles);
  };

  useUnmount(() => {
    files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  });

  return (
    <Stack w="full" spacing={4}>
      {!files.length ? (
        <chakra.section h="xl" w="full" bg="rgba(0, 0, 0, 0.04)">
          <chakra.div h="full" {...getRootProps()}>
            <Stack h="full" align="center" justify="center">
              <Button
                variant="outline"
                rounded="8px"
                color="rgb(0 0 0 / 72%)"
                borderColor="rgb(0 0 0 / 12%)"
                fontSize="md"
                fontWeight="400"
              >
                Add Files
              </Button>

              <Text fontWeight="400" color="rgb(0 0 0 / 48%)">
                or drop files to upload
              </Text>
            </Stack>
          </chakra.div>
        </chakra.section>
      ) : (
        <chakra.section h="xl" w="full" pos="relative">
          <IconButton
            pos="absolute"
            top="10px"
            right="10px"
            rounded="full"
            bgColor="rgba(255, 255, 255, 0.8)"
            color="black"
            border="none"
            aria-label="delete image"
            icon={<Delete set="bold" />}
            onClick={() => removeImage(activeImage)}
            _hover={{
              bgColor: "rgba(255, 255, 255, 0.8)",
              transform: "scale(1.05)",
            }}
          />

          <Image
            src={activeImage.preview}
            alt="Product image"
            objectFit="cover"
            objectPosition="center 70%"
            boxSize="100%"
          />
        </chakra.section>
      )}

      <Stack direction="row" spacing={3}>
        {files.map((file: any, idx: number) => (
          <Center
            key={idx}
            boxSize="50px"
            cursor="pointer"
            p={activeImage === file ? 1 : undefined}
            border={
              activeImage === file ? "1px solid rgb(0 0 0 / 80%)" : undefined
            }
            onClick={() => setActiveImage(file)}
          >
            <Image
              src={file.preview}
              alt="Product image"
              objectFit="cover"
              objectPosition="center 70%"
              boxSize="100%"
            />
          </Center>
        ))}

        <Center
          border="1px dashed rgba(0, 0, 0, 0.24)"
          bg="rgba(0, 0, 0, 0.04)"
          rounded="2px"
          cursor="pointer"
          boxSize="50px"
          onClick={open}
        >
          <Icon boxSize={5} as={HiUpload} />
        </Center>
      </Stack>

      <input {...getInputProps()} />
    </Stack>
  );
};
