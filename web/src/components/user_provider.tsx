'use client'

import { getSessionToken, removeSessionToken, setSessionToken } from "@/app/session";
import { UserInfo } from "@/lib/backend/lib";
import { createContext, ReactNode, useEffect, useState } from "react";
import Backend from "@/lib/backend/lib"
import { Result } from "@/lib/backend/result";
import { Error } from "@/lib/backend/error";

interface TokenValue {
  token: string | null,
  userInfo: Result<UserInfo, Error> | null,
  setToken: (newToken: string | null) => void
}

export const UserContext = createContext<TokenValue>({
  token: null,
  userInfo: null,
  setToken(_) {}
})

export default function UserProvider({ children }: { children: ReactNode }) {
  const [ token, setTokenInner ] = useState<string | null>(null)
  const [ userInfo, setUserInfo ] = useState<Result<UserInfo, Error> | null>(null)
  
  function setToken(newToken: string | null) {
    if (newToken != null) {
      setSessionToken(newToken)
      
      setUserInfo(null);
      
      // Try fetch new user asynchronously
      (async () => {
        setUserInfo(await Backend.me(newToken))
      })()
    } else {
      removeSessionToken()
    }
    
    setTokenInner(newToken)
  }
  
  // Make the token up to date, retrieved from local storage
  useEffect(() => {
    setTokenInner(getSessionToken())
  }, [])
  
  return <UserContext.Provider value={{ token, userInfo, setToken }}>
    { children }
  </UserContext.Provider>
}