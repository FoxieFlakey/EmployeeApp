'use client';

import { useEffect, useState } from "react";
import { API_URL, WEB_URL } from "./config";
import * as Backend from "./backend/me";
import { getSessionToken } from "./session";
import { ErrorCode } from "./backend/error";

function ApiPing() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ response, setResponse ] = useState<string | null>(null);
  
  useEffect(() => {
    (async () => {
      const token = getSessionToken()
      if (token == null) {
        setError("You're not logged in, please login")
        setLoading(false)
        return
      }
      
      const me = await Backend.me(token)
      if (!me.ok) {
        if (me.value.code == ErrorCode.InvalidSessionToken) {
          setError("You're not logged in, please login")
        } else {
          setError("Cannot retrieve your user info: " + me.value.message)
        }
        setLoading(false)
        return
      }
      
      setResponse(JSON.stringify(me.value))
      setLoading(false)
    })()
  }, []);
  
  if (loading) {
    return <p>Loading...</p>
  }
  
  if (response) {
    return <p>Got response: { response }</p>
  }
  
  return <p>An error occured: { error }</p>
}

export default function Home() {
  return (
    <>
      <p>
        Response from backend is
      </p>
      
      <div style={{
        margin: "5px",
        backgroundColor: "#888888"
      }}>
        <ApiPing />
      </div>
      
      <p>
        URL for web is <a href={ WEB_URL }>{ WEB_URL }</a><br></br>
        URL for API is <a href={ API_URL }>{ API_URL }</a>
      </p>
    </>
  );
}
