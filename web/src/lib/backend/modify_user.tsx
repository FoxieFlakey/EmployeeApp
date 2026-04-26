import JSONBigMaker from "json-bigint"
import { Error, validateErrorResponse } from "./error";
import { UserRole } from "./lib";
import { failed, ok, Result } from "./result";
import { API_URL } from "@/app/config";

const JSONBig = JSONBigMaker({
  alwaysParseAsBig: true,
  strict: true,
  useNativeBigInt: true
})

export interface ModifyUserInfo {
  username?: string,
  display_name?: string,
  fullname?: string,
  role?: UserRole,
  password?: string
}

export async function modify_user(sessionToken: string, target: BigInt, changes: ModifyUserInfo): Promise<Result<void, Error>> {
  const result = await fetch(API_URL + `/users/${target}/profile`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSONBig.stringify(changes)
    })
  
  const resultBody = JSONBig.parse(await result.text())
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  return ok(undefined)
}

