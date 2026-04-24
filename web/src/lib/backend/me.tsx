import { API_URL } from "../../app/config";
import { Error, ErrorCode, validateErrorResponse } from "./error";
import { UserInfo } from "./lib";
import { failed, ok, Result } from "./result";
import { validateUserInfoObject } from "./validations";

export async function me(sessionToken: string): Promise<Result<UserInfo, Error>> {
  const result = await fetch(API_URL + "/me", {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${sessionToken}`
    }
  })
  
  const resultBody = JSON.parse(await result.text())
  
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  const userInfo = validateUserInfoObject(resultBody)
  if (userInfo == null) {
    return failed({
      code: ErrorCode.ServerError,
      message: "Server sent malformed response"
    })
  }
  
  return ok(userInfo)
}

