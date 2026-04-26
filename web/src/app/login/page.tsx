'use client'

import { redirect } from "next/navigation";
import { useContext, useState } from "react";

import styles from "./page.module.css"
import { setSessionToken } from "../session";
import Backend from "@/lib/backend/lib";
import { unwrap, unwrap_err as unwrapErr } from "@/lib/backend/result";
import { ErrorCode } from "@/lib/backend/error";
import { UserContext } from "@/components/user_provider";
import StyledButton from "@/components/button";

export default function LoginScreen() {
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null)
  const [ isLoggingIn, setLoggingIn ] = useState(false)
  const { token, setToken } = useContext(UserContext)
  
  const doSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoggingIn(true);
    
    (async () => {
      const data = new FormData(event.currentTarget)
      const username = data.get("username")!.toString()
      const password = data.get("password")!.toString()
      
      const result = await Backend.login(username, password)
      if (!result.ok) {
        setLoggingIn(false)
        
        const error = unwrapErr(result)
        
        switch (error.code) {
        case ErrorCode.WrongPassword:
          setErrorMessage("Incorrect password, try again")
          break
        case ErrorCode.UnknownUser:
          setErrorMessage("Cannot find that user, make sure the username typed correctly")
          break
        case ErrorCode.FrozenUser:
          setErrorMessage("This account is frozen and can't be log into")
          break
        default:
          setErrorMessage(`Cannot login, please try again later. Error: ${error.message}`)
          break
        }
        
        return
      }
      
      setToken(unwrap(result).session_token)
      setSessionToken(unwrap(result).session_token)
      redirect("/")
    })()
  }
  
  return <>
    <div id="errorDiv" className={ styles.errorDiv } hidden={ errorMessage == null }>
      <p>{ errorMessage }</p>
    </div>
    
    <form onSubmit={ doSubmit } style={{ margin: "4px" }}>
      <table>
        <tbody>
          <tr>
            <td><label htmlFor="username">Username: </label></td>
            <td><input name="username" type="text" required /></td>
          </tr>
          
          <tr>
            <td><label htmlFor="password">Password: </label></td>
            <td><input name="password" type="password" required /></td>
          </tr>
        </tbody>
      </table>
      
      <StyledButton type="submit" disabled={isLoggingIn}>{isLoggingIn ? "Logging in..." : "Login" }</StyledButton>
    </form>
  </>
}

