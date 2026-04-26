import { API_URL } from "@/app/config"
import JSONBigMaker from "json-bigint"
import { failed, ok, Result } from "./result"
import { Error, ErrorCode, validateErrorResponse } from "./error"
import { validateAllowedUserChanges } from "./validations"

const JSONBig = JSONBigMaker({
  alwaysParseAsBig: true,
  strict: true,
  useNativeBigInt: true
})

export interface AllowedUserChanges {
  username: boolean
  password: boolean
  display_name: boolean
  fullname: boolean
  role: boolean
}

export async function get_allowed_changes_to_user(sessionToken: string, target: BigInt): Promise<Result<AllowedUserChanges, Error>> {
  const result = await fetch(API_URL + `/users/${target}/allowed_changes`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      }
    })
  
  const resultBody = JSONBig.parse(await result.text())
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  const ret = validateAllowedUserChanges(resultBody)
  if (ret == null) {
    return failed({
      code: ErrorCode.ServerError,
      message: "server sent malformed response"
    })
  }
  
  return ok(ret)
}



