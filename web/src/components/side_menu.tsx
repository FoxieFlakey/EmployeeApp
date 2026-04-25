'use client'

import { removeSessionToken } from "@/app/session"
import Backend from "@/lib/backend/lib"
import StyledButton from "./button"
import { redirect } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import Centered from "./centered"
import { UserContext } from "./user_provider"

export default function SideMenu() {
  const [isLoggedIn, setLoggedIn] = useState(true)
  const { token, setToken } = useContext(UserContext)
  
  useEffect(() => {
    (async () => {
      if (token != null) {
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    })()
  }, [token])
  
  function logout() {
    setToken(null)
    redirect("/login")
  }
  
  return <>
    <Centered>
      { isLoggedIn ? (
        <StyledButton style={{ fontSize: "large" }} onClick={ () => logout() }>
          Logout
        </StyledButton>
      ) : (
        <StyledButton style={{ fontSize: "large" }} onClick={ () => redirect("/login") }>
          Login
        </StyledButton>
      ) }
    </Centered>
  </>
}

