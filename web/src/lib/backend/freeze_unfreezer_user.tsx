import JSONBigMaker from "json-bigint"
import { API_URL } from "@/app/config"
import { Error, validateErrorResponse } from "./error"
import { failed, ok, Result } from "./result"

const JSONBig = JSONBigMaker({
  alwaysParseAsBig: true,
  strict: true,
  useNativeBigInt: true
})

export async function freeze_user(session_token: string, id: BigInt) {
  return freezeUserImpl(session_token, id, true)
}

export async function unfreeze_user(session_token: string, id: BigInt) {
  return freezeUserImpl(session_token, id, false)
}

async function freezeUserImpl(session_token: string, id: BigInt, freeze: boolean): Promise<Result<void, Error>> {
  const freezeUrl = API_URL + `/users/${id}/freeze`
  const unfreezeUrl = API_URL + `/users/${id}/unfreeze`
  
  const result = await fetch(freeze ? freezeUrl : unfreezeUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${session_token}`
    }
  })
  
  const resultBody = JSONBig.parse(await result.text())
  
  if (!result.ok) {
    return failed(validateErrorResponse(resultBody))
  }
  
  return ok(undefined)
}

