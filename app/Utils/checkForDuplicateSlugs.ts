import { db } from "~/lib/db.server"

const checkForDuplicateSlugs = async (slug: string): Promise<boolean> => {
  const duplicate = await db.dao.findUnique({
    where: { slug },
  })

  return Boolean(duplicate)
}

export default checkForDuplicateSlugs
