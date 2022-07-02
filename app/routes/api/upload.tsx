import {
  ActionFunction,
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"

import { badRequest } from "~/lib/remix"

export type GetSignedUrlActionData = { url: string }

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_createFileUploadHandler({
    file: ({ filename }) => filename,
  })
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const image = formData.get("myImage") as any
  const body = new FormData() as any
  body.append("file", image, image?.name as string)

  const response = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/34059050b196d242ae7e2baffe4d4b48/images/v1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer 7PB3HbmH1idyzFdIxEyc4f0dPupss-cJ1bpKCJ3j`,
      },
      body,
    },
  )

  const res = await response.json()

  console.log(res)

  if (!res.success) return badRequest({ uploadError: "Something went wrong" })

  return json({ url: res.result.variants[0] })
}
