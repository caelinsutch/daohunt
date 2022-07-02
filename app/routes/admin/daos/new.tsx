import React from "react"
import * as c from "@chakra-ui/react"
import { DaoCategory } from "@prisma/client"
import { ActionFunction, redirect } from "@remix-run/node"
import { useTransition } from "@remix-run/react"
import { z } from "zod"

import { Form } from "~/components/Form"
import { DaoForm } from "~/components/Organisms/Forms"
import { Tile, TileBody, TileFooter, TileHeader, TileHeading } from "~/components/Tile"
import { db } from "~/lib/db.server"
import { validateFormData } from "~/lib/form"
import { badRequest } from "~/lib/remix"
import { getCurrentUser } from "~/services/auth/auth.server"

export const action: ActionFunction = async ({ request }) => {
  const postSchema = z.object({
    name: z.string().min(1, { message: "Required" }),
    slug: z
      .string()
      .min(1, { message: "Required" })
      .regex(/^[a-zA-Z0-9_-]*$/, { message: "Must be a valid URL" }),
    description: z.string().min(1, { message: "Required" }),
    category: z.nativeEnum(DaoCategory, { errorMap: () => ({ message: "Invalid category" }) }),
    photo: z.string(),
  })
  const formData = await request.formData()
  const { data, fieldErrors } = await validateFormData(postSchema, formData)
  const user = await getCurrentUser(request)
  if (fieldErrors) return badRequest({ fieldErrors, data })
  const post = await db.dao.create({
    data: {
      ...data,
      slug: data.name.replace(" ", ""),
      shortDescription: "",
      author: { connect: { id: user.id } },
    },
  })
  return redirect(`/admin/daos/${post.slug}`)
}

export default function NewPost() {
  const [isDirty, setIsDirty] = React.useState(false)
  const { state } = useTransition()
  const isSubmitting = state === "submitting"

  return (
    <c.Stack spacing={4}>
      <c.Flex justify="space-between">
        <c.Heading>New DAO</c.Heading>
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
            <DaoForm />
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
