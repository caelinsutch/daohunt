import { Role } from "@prisma/client"
import { db } from "../lib/db.server"

const upgradeUser = async() => {
  await db.user.update({ where: { id: "5b441104-b057-4d5b-86bb-f4efc47dd5ac"}, data: { role: Role.ADMIN}})
}

upgradeUser().then(() => console.log('done')) 