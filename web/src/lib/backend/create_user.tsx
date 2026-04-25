import JSONBigMaker from "json-bigint"
import { API_URL } from "@/app/config";
import { UserRole } from "./lib";
import { Error, validateErrorResponse } from "./error";
import { failed, ok, Result } from "./result";

const JSONBig = JSONBigMaker({
  alwaysParseAsBig: true,
  strict: true,
  useNativeBigInt: true
})

export interface CreateUserInfo {
  username: string,
  password: string,
  displayName?: string,
  fullname: string,
  role: UserRole
}

export async function create_user(sessionToken: string, info: CreateUserInfo): Promise<Result<void, Error>> {
  const result = await fetch(API_URL + "/create_user", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${sessionToken}`
    },
    body: JSONBig.stringify(info)
  })
  
  const resultBody = JSONBig.parse(await result.text())
  
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  return ok(undefined)
}

