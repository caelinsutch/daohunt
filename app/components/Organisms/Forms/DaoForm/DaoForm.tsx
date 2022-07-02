import React from "react"
import * as c from "@chakra-ui/react"
import { DaoCategory } from "@prisma/client"
import { useFetcher } from "@remix-run/react"

import { FormError, FormField, ImageField } from "~/components/Form"
import { categoryOptions } from "~/Constants"

type DaoFormData = {
  name?: string
  slug?: string
  description?: string
  photo?: string | null
  category?: DaoCategory
}

const DaoForm: React.FC<{ defaults?: DaoFormData }> = ({ defaults }) => {
  const uploader = useFetcher()

  const handleUpdatePhoto = (photo: string) => {
    uploader.submit({ photo }, { method: "post" })
  }

  return (
    <c.Stack spacing={4}>
      <ImageField name="photo" label="Logo" defaultValue={defaults?.photo} onUpload={handleUpdatePhoto} />
      <FormField name="name" label="Name" placeholder="Twitter Dao" min={1} defaultValue={defaults?.name} />
      <FormField name="slug" label="Slug" placeholder="twitter-dao" min={1} defaultValue={defaults?.slug} />
      <FormField
        name="description"
        label="Description"
        input={<c.Textarea rows={6} />}
        defaultValue={defaults?.description}
      />
      <FormField
        name="category"
        label="Category"
        placeholder="Select category"
        defaultValue={defaults?.category}
        input={
          <c.Select>
            {categoryOptions.map(({ value, label }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </c.Select>
        }
      />
      <FormError />
    </c.Stack>
  )
}

export default DaoForm
