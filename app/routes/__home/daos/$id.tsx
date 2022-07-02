import * as c from "@chakra-ui/react"
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { Limiter } from "~/components/Limiter"
import { db } from "~/lib/db.server"
import { useLoaderHeaders } from "~/lib/headers"
import { AwaitedFunction } from "~/lib/helpers/types"

const getPost = async (slug?: string) => {
  if (!slug) throw new Response("ID required", { status: 400 })
  const post = await db.dao.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      author: { select: { firstName: true, avatar: true } },
    },
  })
  if (!post) throw new Response("Not Found", { status: 404 })
  return { post }
}
export const headers = useLoaderHeaders

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const data = await getPost(id)
  return json(data, { headers: { "Cache-Control": "max-age=300, s-maxage=36000" } })
}

type LoaderData = AwaitedFunction<typeof getPost>

export default function PostDetail() {
  const { post } = useLoaderData<LoaderData>()
  return (
    <Limiter pt="65px">
      <c.Stack py={10} spacing={8}>
        <c.Stack justify="space-between">
          <c.Heading fontSize={{ base: "2xl", md: "3xl" }}>{post.name}</c.Heading>
          <c.Box>
            <c.Tag>{post.category}</c.Tag>
          </c.Box>
        </c.Stack>

        <c.Stack>
          <c.Text>{post.description}</c.Text>
        </c.Stack>
        {post.author.avatar && (
          <c.HStack>
            <c.Avatar size="sm" src={post.author.avatar} name={post.author.firstName} />
            <c.Text>{post.author.firstName}</c.Text>
          </c.HStack>
        )}
      </c.Stack>
    </Limiter>
  )
}
