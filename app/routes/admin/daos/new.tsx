import * as React from "react"
import * as c from "@chakra-ui/react"
import { ActionFunction, redirect } from "@remix-run/node"
import { useTransition } from "@remix-run/react"
import { z } from "zod"

import { Form, FormError, FormField } from "~/components/Form"
import { Tile, TileBody, TileFooter, TileHeader, TileHeading } from "~/components/Tile"
import { db } from "~/lib/db.server"
import { validateFormData } from "~/lib/form"
import { badRequest } from "~/lib/remix"
import { getCurrentUser } from "~/services/auth/auth.server"
import { DaoCategory } from "@prisma/client"

export const action: ActionFunction = async ({ request }) => {
  const postSchema = z.object({
    name: z.string().min(1, { message: "Required" }),
    description: z.string().min(1, { message: "Required" }),
    category: z.nativeEnum(DaoCategory, { errorMap: () => ({ message: "Invalid category" }) }),
  })
  const formData = await request.formData()
  const { data, fieldErrors } = await validateFormData(postSchema, formData)
  const user = await getCurrentUser(request)
  if (fieldErrors) return badRequest({ fieldErrors, data })
  const post = await db.dao.create({ data: { ...data, slug: data.name.replace(' ', ''), shortDescription: '', description: '', author: { connect: { id: user.id } } } })
  return redirect(`/admin/posts/${post.id}`)
}

const categoryOptions: { label: string; value: DaoCategory }[] = [
  { value: DaoCategory.Collector, label: "Collector" },
]

export default function NewPost() {
  const [isDirty, setIsDirty] = React.useState(false)
  const { state } = useTransition()
  const isSubmitting = state === "submitting"

  return (
    <c.Stack spacing={4}>
      <c.Flex justify="space-between">
        <c.Heading>New post</c.Heading>
      </c.Flex>

      <Form
        method="post"
        onChange={(e) => {
          const formData = new FormData(e.currentTarget)
          const data = Object.fromEntries(formData)
          const isDirty = Object.values(data).some((val) => !!val)
          setIsDirty(isDirty)
        }}
      >
        <Tile>
          <TileHeader>
            <TileHeading>Info</TileHeading>
          </TileHeader>
          <TileBody>
            <c.Stack spacing={4}>
              <FormField name="name" label="Name" placeholder="My post" min={1} />
              <FormField name="description" label="Description" input={<c.Textarea rows={6} />} />
              <FormField
                name="category"
                label="Category"
                placeholder="Select category"
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
          </TileBody>
          <TileFooter>
            <c.ButtonGroup>
              <c.Button
                type="submit"
                isDisabled={isSubmitting || !isDirty}
                isLoading={isSubmitting}
                colorScheme="purple"
                size="sm"
              >
                Create
              </c.Button>
            </c.ButtonGroup>
          </TileFooter>
        </Tile>
      </Form>
    </c.Stack>
  )
}
