import JSONBigMaker from "json-bigint"
import { API_URL } from "@/app/config";
import { UserInfo } from "./lib";
import { failed, ok, Result } from "./result";
import { Error, ErrorCode, validateErrorResponse } from "./error";
import { validateUserInfoObject } from "./validations";

const JSONBig = JSONBigMaker({
  alwaysParseAsBig: true,
  strict: true,
  useNativeBigInt: true
})

export async function find_user(session_token: string, id: BigInt): Promise<Result<UserInfo, Error>> {
  const result = await fetch(API_URL + `/users/${id}/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${session_token}`
    }
  })
  
  const resultBody = JSONBig.parse(await result.text())
  
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  const list = validateUserInfoObject(resultBody)
  if (list == null) {
    return failed({
      code: ErrorCode.ServerError,
      message: "Server sent malformed response"
    })
  }
  
  return ok(list)
}

