import {
  Button,
  Center,
  chakra,
  Icon,
  IconButton,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Api from "libs/api";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Delete } from "react-iconly";
import { HiUpload } from "react-icons/hi";

type useFileUploadProps = {
  bucket: string;
  disabled?: boolean;
  onUpload: (files: any[]) => void;
};

export function useFileUpload({
  bucket,
  onUpload,
  disabled,
}: useFileUploadProps) {
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/*",
    maxFiles: 8,
    disabled: disabled || loading,
    onDrop: async (acceptedFiles) => {
      const fileData: any[] = [];
      setLoading(true);

      for (let file of acceptedFiles) {
        try {
          // upload file
          const { payload: uploadedFile } = await Api().request(
            `/api/upload?filename=${file.name}&bucket=${bucket}`,
            {
              method: "POST",
              headers: { "Content-Type": file.type },
              body: file,
            }
          );

          fileData.push({
            key: uploadedFile.key,
            url: uploadedFile.publicUrl,
            hash: uploadedFile.hash,
          });
        } catch (e) {
          console.log("Error uploading file", e);
        } finally {
          continue;
        }
      }

      await onUpload(fileData);

      setLoading(false);
    },
  });

  return {
    open,
    loading,
    getInputProps,
    getRootProps,
  };
}

type FilePickerProps = {
  files: any[];
  bucket: string;
  disabled: boolean;
  setFiles: (value: any) => void;
};
export const FilePicker = ({
  files,
  setFiles,
  disabled,
  bucket,
}: FilePickerProps) => {
  const toast = useToast();
  const [activeImage, setActiveImage] = useState<any>(files[0]?.url || null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/*",
    maxFiles: 8,
    disabled: disabled || loading,
    onDrop: async (acceptedFiles) => {
      const fileData: any[] = [];
      setLoading(true);

      for (let file of acceptedFiles) {
        try {
          // upload file
          const { payload: uploadedFile } = await Api().request(
            `/api/upload?filename=${file.name}&bucket=${bucket}`,
            {
              method: "POST",
              headers: { "Content-Type": file.type },
              body: file,
            }
          );

          fileData.push({
            key: uploadedFile.key,
            url: uploadedFile.publicUrl,
            hash: uploadedFile.hash,
          });
        } catch (e) {
          console.log("Error uploading file", e);
        } finally {
          continue;
        }
      }

      if (fileData[0]) setActiveImage(fileData[0].url);
      setFiles(files.concat(...fileData));
      setLoading(false);
    },
  });

  const removeImage = async (fileUrl: any) => {
    const file = files.find((file) => file.url === fileUrl);
    setLoading(true);

    // send api request to delete image
    try {
      await Api().delete(`/api/upload?filename=${file.key}&bucket=${bucket}`);
      const newFiles = files.filter((f: any) => f.key !== file.key);

      setActiveImage(newFiles[newFiles.length - 1]?.url || null);
      setFiles(newFiles);
    } catch (e: any) {
      toast({
        title: "Error deleting file",
        description: e.message,
        position: "bottom-right",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack w="full" spacing={4}>
      {!files.length ? (
        <chakra.section
          h={{ base: "sm", md: "xl" }}
          w="full"
          bg="rgba(0, 0, 0, 0.04)"
        >
          <chakra.div h="full" {...getRootProps()}>
            <Stack h="full" align="center" justify="center">
              <Button
                variant="primary-outline"
                color="rgb(0 0 0 / 72%)"
                borderColor="rgb(0 0 0 / 12%)"
                fontSize="md"
                fontWeight="400"
                isLoading={loading}
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
        <chakra.section h={{ base: "sm", md: "xl" }} w="full" pos="relative">
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
            src={activeImage}
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
            p={activeImage === file.url ? 1 : undefined}
            border={
              activeImage === file.url
                ? "1px solid rgb(0 0 0 / 80%)"
                : undefined
            }
            onClick={() => setActiveImage(file.url)}
          >
            <Image
              src={file.url}
              alt="Product image"
              objectFit="cover"
              objectPosition="center 70%"
              boxSize="100%"
            />
          </Center>
        ))}

        <IconButton
          aria-label="Add Image"
          boxSize="50px"
          border="1px dashed rgba(0, 0, 0, 0.24)"
          bgColor="rgba(0, 0, 0, 0.04)"
          color="inherit"
          rounded="2px"
          onClick={open}
          isLoading={loading}
          isDisabled={disabled}
          _hover={{ bgColor: "rgba(0, 0, 0, 0.04)" }}
          icon={<Icon boxSize={5} as={HiUpload} />}
        />
      </Stack>

      <input {...getInputProps()} />
    </Stack>
  );
};
