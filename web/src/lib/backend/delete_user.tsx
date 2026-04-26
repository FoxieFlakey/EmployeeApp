import JSONBigMaker from "json-bigint"
import { API_URL } from "@/app/config"
import { Error, validateErrorResponse } from "./error"
import { failed, ok, Result } from "./result"

const JSONBig = JSONBigMaker({
  alwaysParseAsBig: true,
  strict: true,
  useNativeBigInt: true
})

export async function delete_user(session_token: string, id: BigInt): Promise<Result<void, Error>> {
  const result = await fetch(API_URL + `/users/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${session_token}`
    }
  })
  
  if (!result.ok) {
    return failed(validateErrorResponse(JSONBig.parse(await result.text())))
  }
  
  return ok(undefined)
}



