import React from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

type FormGroupProps = {
  id: string;
  label?: string;
  labelProps?: FormLabelProps;
  helperText?: string;
  rightAddonText?: string;
  required?: boolean;
  children: any;
};
export const FormGroup = (props: FormGroupProps) => (
  <FormControl id={props.id} isRequired={props.required}>
    {props.label && <FormLabel {...props.labelProps}>{props.label}</FormLabel>}

    <InputGroup>
      {React.cloneElement(props.children, {
        pr: props.rightAddonText ? "7rem" : undefined,
      })}

      {props.rightAddonText && (
        <InputRightElement w="7rem" py={6}>
          <Text fontSize="2xl" fontWeight="500">
            {props.rightAddonText}
          </Text>
        </InputRightElement>
      )}
    </InputGroup>

    {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
  </FormControl>
);
