import * as c from "@chakra-ui/react"
import { Button, HStack } from "@chakra-ui/react"
import { Prisma } from "@prisma/client"
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import dayjs from "dayjs"

import { LinkButton } from "~/components/LinkButton"
import { Search } from "~/components/Search"
import { Column, Table } from "~/components/Table"
import { Tile } from "~/components/Tile"
import { db } from "~/lib/db.server"
import { AwaitedFunction } from "~/lib/helpers/types"
import { getTableParams, TableParams } from "~/lib/table"

const getPosts = async ({ search, ...tableParams }: TableParams) => {
  const posts = await db.dao.findMany({
    ...tableParams,
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { author: { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } } },
            { author: { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      slug: true,
      photo: true,
      description: true,
      shortDescription: true,
      category: true,
      author: { select: { id: true, avatar: true, firstName: true, lastName: true } },
      createdAt: true,
    },
  })
  const count = await db.dao.count()
  return { posts, count }
}

const TAKE = 10

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await getPosts(getTableParams(request, TAKE, { createdAt: Prisma.SortOrder.desc }))
  return json(posts)
}

type LoaderData = AwaitedFunction<typeof getPosts>
type Dao = LoaderData["posts"][0]

export default function Posts() {
  const navigate = useNavigate()
  const { posts, count } = useLoaderData<LoaderData>()

  return (
    <>
      <c.Stack spacing={4}>
        <c.Flex justify="space-between">
          <c.Heading>Daos</c.Heading>
          <LinkButton to="new" colorScheme="purple">
            Create
          </LinkButton>
        </c.Flex>
        <Search placeholder="Search posts" />
        <Tile>
          <Table noDataText="No posts found" data={posts} take={TAKE} count={count}>
            <Column<Dao>
              sortKey="name"
              header="Name"
              row={({ name, photo }) => (
                <HStack>
                  <c.Avatar name={name} size="xs" src={photo ?? undefined} />
                  <c.Text>{name}</c.Text>
                </HStack>
              )}
            />
            <Column<Dao> sortKey="category" header="Category" row={(post) => <c.Tag>{post.name}</c.Tag>} />
            <Column<Dao>
              sortKey="author.firstName"
              display={{ base: "none", md: "flex" }}
              header="Author"
              row={(post) => post.author.firstName + " " + post.author.lastName}
            />
            <Column<Dao>
              sortKey="createdAt"
              header="Created"
              row={(post) => dayjs(post.createdAt).format("MM/DD/YYYY")}
            />
            <Column<Dao>
              header="Actions"
              row={(dao) => (
                <HStack>
                  <Button onClick={() => navigate(`${dao.slug}?isOpen=true`)}>Edit</Button>
                  <Button onClick={() => navigate(dao.slug)} colorScheme="purple">
                    View
                  </Button>
                </HStack>
              )}
            />
          </Table>
        </Tile>
      </c.Stack>
    </>
  )
}
