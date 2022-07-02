import * as c from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { DaoCategory } from "@prisma/client"
import { ActionFunction, HeadersFunction, json, LoaderFunction } from "@remix-run/node"
import { useLoaderData, useLocation } from "@remix-run/react"
import { z } from "zod"

import EditDaoModal from "~/components/Molecules/Modals/EditDaoModal/EditDaoModal"
import { db } from "~/lib/db.server"
import { validateFormData } from "~/lib/form"
import { AwaitedFunction } from "~/lib/helpers/types"
import { badRequest } from "~/lib/remix"

export const headers: HeadersFunction = () => {
  return { "Cache-Control": "max-age=300, s-maxage=3600" }
}

const getPost = async (slug?: string) => {
  if (!slug) throw new Response("ID required", { status: 400 })
  const post = await db.dao.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      author: true,
      slug: true,
      shortDescription: true,
      photo: true,
    },
  })
  if (!post) throw new Response("Not Found", { status: 404 })
  return { post }
}

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const data = await getPost(id)
  return json(data)
}

type LoaderData = AwaitedFunction<typeof getPost>

export const action: ActionFunction = async ({ request, params: { id } }) => {
  if (!id) throw new Error("Needs ID")

  const postSchema = z.object({
    name: z.string().min(1, { message: "Required" }).optional(),
    slug: z
      .string()
      .min(1, { message: "Required" })
      .regex(/^[a-zA-Z0-9_-]*$/, { message: "Must be a valid URL" })
      .optional(),
    description: z.string().min(1, { message: "Required" }).optional(),
    category: z.nativeEnum(DaoCategory, { errorMap: () => ({ message: "Invalid category" }) }).optional(),
    photo: z.string().nullable().optional(),
  })

  const formData = await request.formData()
  const { data, fieldErrors } = await validateFormData(postSchema, formData)
  if (fieldErrors) return badRequest({ fieldErrors, data })

  await db.dao.update({
    where: { slug: id },
    data: {
      ...data,
    },
  })

  return json({ success: true }, 200)
}

export default function PostDetail() {
  const location = useLocation()
  const { post } = useLoaderData<LoaderData>()
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: location.search.includes("isOpen") })

  return (
    <>
      <EditDaoModal defaults={post} isOpen={isOpen} onClose={onClose} />
      <c.Box>
        <c.Flex justify="space-between">
          <c.Stack>
            <c.HStack>
              {post.photo && (
                <c.Avatar size="xl" src={post.photo} name={post.photo} background="transparent" />
              )}
              <c.Heading fontWeight={800}>{post.name}</c.Heading>
              <c.Tag>{post.category}</c.Tag>
              <c.Button onClick={onOpen}>Edit</c.Button>
            </c.HStack>
            <c.Text>{post.description}</c.Text>
          </c.Stack>
        </c.Flex>
      </c.Box>
    </>
  )
}
