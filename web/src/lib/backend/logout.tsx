'use client';

import { API_URL } from "../../app/config";
import { Error, ErrorCode, validateErrorResponse } from "./error";
import { failed, ok, Result } from "./result";

export async function logout(token: string): Promise<Result<void, Error>> {
  const result = await fetch(API_URL + "/logout", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!result.ok) {
    return failed(validateErrorResponse(JSON.parse(await result.text())))
  }
  
  return ok(undefined);
}
