import React, { useEffect } from "react"
import * as c from "@chakra-ui/react"
import { Dao } from "@prisma/client"
import { Form, useTransition } from "@remix-run/react"

import Modal from "~/components/Modal"
import { DaoForm } from "~/components/Organisms/Forms"
import { useToast } from "~/lib/hooks/useToast"

type DaoData = Pick<Dao, "category" | "name" | "description" | "shortDescription" | "slug" | "id" | "photo">

type EditDaoModalProps = {
  isOpen: boolean
  onClose: () => void
  defaults?: DaoData
}

const EditDaoModal: React.FC<EditDaoModalProps> = ({ isOpen, onClose, defaults }) => {
  const [isDirty, setIsDirty] = React.useState(false)
  const { state, type } = useTransition()
  const toast = useToast()

  const isSubmitting = state === "submitting"

  useEffect(() => {
    if (type === "actionRedirect") {
      toast({ description: "Profile updated", status: "success" })
      setIsDirty(false)
    }
  }, [type])

  return (
    <Modal title={defaults ? "Edit Dao" : "Create Dao"} isOpen={isOpen} onClose={onClose}>
      <Form
        method="post"
        action={`?id=${defaults?.id}`}
        onChange={(e) => {
          const formData = new FormData(e.currentTarget)
          const data = Object.fromEntries(formData)
          const isDirty = Object.values(data).some((val) => !!val)
          setIsDirty(isDirty)
        }}
      >
        <DaoForm defaults={defaults} />
        <c.ButtonGroup mt={4}>
          <c.Button onClick={onClose}>Close</c.Button>
          <c.Button
            type="submit"
            isDisabled={isSubmitting || !isDirty}
            isLoading={isSubmitting}
            colorScheme="purple"
          >
            {defaults ? "Submit" : "Create"}
          </c.Button>
        </c.ButtonGroup>
      </Form>
    </Modal>
  )
}

export default EditDaoModal
