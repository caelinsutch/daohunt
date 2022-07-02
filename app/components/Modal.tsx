import React, { ReactNode } from "react"
import * as c from "@chakra-ui/react"

type ModalProps = {
  title?: string
  children?: ReactNode
} & c.ModalProps

const Modal: React.FC<ModalProps> = (props) => (
  <c.Modal {...props}>
    <c.ModalOverlay />
    <c.ModalContent borderRadius="md">
      <c.ModalCloseButton />
      {props.title && <c.ModalHeader pb={3}>{props.title}</c.ModalHeader>}
      <c.ModalBody mb={4}>{props.children}</c.ModalBody>
    </c.ModalContent>
  </c.Modal>
)

export default Modal
