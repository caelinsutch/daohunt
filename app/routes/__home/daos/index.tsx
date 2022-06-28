import * as c from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/react"
import { json,LoaderFunction, MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import DaoCard from "~/components/DaoCard"
import { Limiter } from "~/components/Limiter"

import { Tile, TileBody, TileFooter, TileHeader, TileHeading } from "~/components/Tile"
import { db } from "~/lib/db.server"
import { useLoaderHeaders } from "~/lib/headers"
import { AwaitedFunction } from "~/lib/helpers/types"
import { createImageUrl } from "~/lib/s3"

dayjs.extend(relativeTime)

export const meta: MetaFunction = () => {
  return { title: "Posts" }
}
export const headers = useLoaderHeaders

const getPosts = async () => {
  const posts = await db.dao.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      tags: true,
      website: true,
      category: true,
      createdAt: true,
      photo: true,
    },
  })
  const count = await db.user.count()
  return { posts, count }
}

export const loader: LoaderFunction = async () => {
  const posts = await getPosts()
  return json(posts, { headers: { "Cache-Control": "max-age=300, s-maxage=3600" } })
}
type LoaderData = AwaitedFunction<typeof getPosts>

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>()
  return (
    <Limiter pt="65px">
      <c.Stack py={10} spacing={8}>
        <c.Heading fontSize={{ base: "2xl", md: "3xl" }}>Posts</c.Heading>
        <c.SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {posts.map(({ slug, name, category, id, shortDescription, tags, website, photo}) => (
            <Link to={slug} key={id}>
              <DaoCard
                name={name}
                category={category}
                shortDescription={shortDescription}
                tags={tags}
                website={website}
                photo={photo}
              />
            </Link>
          ))}
        </c.SimpleGrid>
      </c.Stack>
    </Limiter>
  )
}
