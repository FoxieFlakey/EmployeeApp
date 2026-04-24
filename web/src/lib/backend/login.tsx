'use client';

import { API_URL } from "../../app/config";
import { Error, ErrorCode, validateErrorResponse } from "./error";
import { failed, ok, Result } from "./result";

export interface LoginResult {
  session_token: string
}

export async function login(username: string, password: string): Promise<Result<LoginResult, Error>> {
  const result = await fetch(API_URL + "/login", {
    body: JSON.stringify({
      username: username,
      password: password
    }),
    method: "POST"
  })
  
  const resultBody = JSON.parse(await result.text())
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  if (!("session_token" in resultBody)) {
    return failed({
      code: ErrorCode.ServerError,
      message: "Server sent malformed JSON"
    })
  }
  
  return ok(resultBody as LoginResult);
}
