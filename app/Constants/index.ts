import { DaoCategory } from "@prisma/client"

export const categoryOptions: { label: string; value: DaoCategory }[] = Object.values(DaoCategory).map(
  (type: any) => ({
    label: DaoCategory[type as DaoCategory],
    value: type,
  }),
)
