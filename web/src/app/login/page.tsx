'use client'

import { redirect } from "next/navigation";
import { useState } from "react";

import styles from "./page.module.css"
import { setSessionToken } from "../session";
import { API_URL } from "../config";

export default function LoginScreen() {
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null)
  const [ isLoggingIn, setLoggingIn ] = useState(false)
  
  const doSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoggingIn(true);
    
    (async () => {
      const data = new FormData(event.currentTarget)
      const username = data.get("username")!.toString()
      const password = data.get("password")!.toString()
      
      const result = await fetch(API_URL + "/login", {
        body: JSON.stringify({
          username: username,
          password: password
        }),
        method: "POST"
      })
      
      if (!result.ok) {
        setLoggingIn(false)
        if (result.status == 401) {
          // Wrong password
          setErrorMessage("Incorrect password, try again")
        } else {
          setErrorMessage("Cannot login, please try again later")
        }
        
        return
      }
      
      const resultBody = JSON.parse(await result.text())
      const sessionToken = resultBody.session_token;
      if (sessionToken == null) {
        setErrorMessage("Malformed response from server, please try again later")
        setLoggingIn(false)
        return
      }
      
      setSessionToken(sessionToken)
      redirect("/")
    })()
  }
  
  return <>
    <div id="errorDiv" className={ styles.errorDiv } hidden={ errorMessage == null }>
      <p>{ errorMessage }</p>
    </div>
    
    <form onSubmit={ doSubmit }>
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
      
      <button type="submit" disabled={isLoggingIn}>{isLoggingIn ? "Logging in..." : "Login" }</button>
    </form>
  </>
}

