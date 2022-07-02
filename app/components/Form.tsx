import * as React from "react"
import * as c from "@chakra-ui/react"
import type { FormProps as RemixFormProps } from "@remix-run/react"
import { Form as RemixForm, useActionData, useTransition } from "@remix-run/react"

import type { ActionData } from "~/lib/form"

import { ImageUploader } from "./ImageUploader"

export const Form = React.forwardRef(function _Form(
  props: Omit<c.BoxProps, "onChange"> & RemixFormProps,
  ref: React.ForwardedRef<HTMLFormElement> | null,
) {
  return (
    <c.Box
      as={RemixForm}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={ref}
      {...props}
    >
      {props.children}
    </c.Box>
  )
})

interface FormFieldProps extends Omit<c.InputProps, "defaultValue"> {
  name: string
  label: string
  input?: React.ReactElement
  defaultValue?: any
}

export function FormField({ label, input, ...props }: FormFieldProps) {
  const form = useActionData<ActionData<any>>()
  const clonedInput =
    input &&
    React.cloneElement(input, {
      defaultValue: form?.data?.[props.name] || "",
      id: props.id || props.name,
      ...props,
    })
  return (
    <c.FormControl isRequired={props.isRequired} isInvalid={!!form?.fieldErrors?.[props.name]}>
      <c.FormLabel htmlFor={props.name}>{label}</c.FormLabel>
      {clonedInput || <c.Input defaultValue={form?.data?.[props.name] || ""} id={props.name} {...props} />}
      <c.FormErrorMessage>{form?.fieldErrors?.[props.name]?.[0]}</c.FormErrorMessage>
    </c.FormControl>
  )
}

interface ImageFieldProps extends Omit<c.FlexProps, "defaultValue"> {
  name: string
  label: string
  defaultValue?: string | null | undefined
  isRequired?: boolean
  placeholder?: string
  onUpload: (avatar: string) => void
}

export function ImageField({
  label,
  placeholder,
  isRequired,
  defaultValue,
  onUpload,
  ...props
}: ImageFieldProps) {
  const form = useActionData<ActionData<any>>()
  const [image, setImage] = React.useState(defaultValue)
  return (
    <c.FormControl isRequired={isRequired} isInvalid={!!form?.fieldErrors?.[props.name]}>
      <c.FormLabel htmlFor={props.name}>{label}</c.FormLabel>
      <c.Box w="100px">
        <ImageUploader
          onSubmit={(avatar) => {
            setImage(avatar)
            onUpload(avatar)
          }}
        >
          {image ? (
            <c.Avatar _hover={{ opacity: 0.8 }} objectFit="cover" src={image} h="100px" w="100px" />
          ) : (
            <c.Center
              _hover={{ bg: "whiteAlpha.100", transition: "100ms all" }}
              bg="whiteAlpha.50"
              h="100px"
              w="100px"
              borderRadius="full"
              {...props}
            >
              <c.Text color="gray.400" fontSize="sm" textAlign="center">
                {placeholder || "Upload an image"}
              </c.Text>
            </c.Center>
          )}
        </ImageUploader>
        <input type="hidden" value={image || ""} name={props.name} />
      </c.Box>
      <c.FormErrorMessage>{form?.fieldErrors?.[props.name]?.[0]}</c.FormErrorMessage>
    </c.FormControl>
  )
}

export function FormError() {
  const form = useActionData<ActionData<any>>()
  if (!form?.formError) return null
  return (
    <c.FormControl isInvalid={!!form?.formError}>
      <c.FormErrorMessage>{form?.formError}</c.FormErrorMessage>
    </c.FormControl>
  )
}
export function FormButton(props: c.ButtonProps) {
  const transition = useTransition()
  return (
    <c.Button
      type="submit"
      isLoading={transition.state === "submitting"}
      isDisabled={transition.state === "submitting"}
      {...props}
    />
  )
}
