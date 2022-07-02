import * as React from "react"
import { ChangeEvent, useEffect, useState } from "react"
import * as c from "@chakra-ui/react"
import { Text, useDisclosure } from "@chakra-ui/react"
import { useFetcher } from "@remix-run/react"

import { useToast } from "~/lib/hooks/useToast"

import { ButtonGroup } from "./ButtonGroup"
import Modal from "./Modal"

type Props = {
  onSubmit: (image: string) => void
}

export const ImageUploader: React.FC<Props> = ({ children, onSubmit }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { Form, data, state } = useFetcher()
  const toast = useToast()
  const [image, setImage] = useState<string>()

  useEffect(() => {
    if (data?.uploadError) toast({ status: "error", title: "Image upload failed" })
    if (data?.url) {
      onSubmit(data.url)
      onClose()
    }
  }, [data])

  const handlePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageUrl: string = URL.createObjectURL(event?.target?.files?.[0] as Blob) as string
    setImage(imageUrl)
  }

  return (
    <>
      <c.Box
        cursor="pointer"
        position="relative"
        _hover={{ opacity: 0.9 }}
        transition="200ms"
        onClick={onOpen}
      >
        {children}
      </c.Box>
      <Modal isOpen={isOpen} onClose={onClose} title="Upload Image">
        {image && (
          <>
            <c.Image alt="image preview" objectFit="contain" w="100%" p={12} maxH="400px" src={image} />
            <Text color="gray.200" fontSize="xs" mt={2}>
              Image Preview
            </Text>
          </>
        )}
        <Form method="post" encType="multipart/form-data" action="/api/upload">
          <c.Button as="label" htmlFor="file-upload" cursor="pointer" mt={4}>
            Pick Image
            <input
              type="file"
              id="file-upload"
              name="myImage"
              onChange={handlePick}
              accept="image/*"
              style={{ display: "none" }}
            />
          </c.Button>
          <ButtonGroup>
            <c.Button variant="ghost" isDisabled={state === "submitting"} onClick={onClose}>
              Cancel
            </c.Button>
            <c.Button
              colorScheme="purple"
              type="submit"
              isLoading={state === "submitting"}
              isDisabled={state === "submitting"}
            >
              Submit
            </c.Button>
            {data?.uploadError}
          </ButtonGroup>
        </Form>
      </Modal>
    </>
  )
}
