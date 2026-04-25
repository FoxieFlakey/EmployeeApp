import JSONBigMaker from "json-bigint"
import { Error, ErrorCode, validateErrorResponse } from "./error";
import { failed, ok, Result } from "./result";
import { API_URL } from "@/app/config";
import { validateUserList } from "./validations";

const JSONBig = JSONBigMaker({
  alwaysParseAsBig: true,
  strict: true,
  useNativeBigInt: true
})

export interface UserList {
  users: BigInt[]
}

export async function list_users(session_token: string): Promise<Result<UserList, Error>> {
  const result = await fetch(API_URL + "/users/list", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${session_token}`
    }
  })
  
  const resultBody = JSONBig.parse(await result.text())
  
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  const list = validateUserList(resultBody)
  if (list == null) {
    return failed({
      code: ErrorCode.ServerError,
      message: "Server sent malformed response"
    })
  }
  
  return ok(list)
}


