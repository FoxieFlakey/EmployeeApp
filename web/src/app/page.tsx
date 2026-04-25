'use client';

import { useContext, useEffect, useState } from "react";
import { API_URL, WEB_URL } from "./config";
import * as Backend from "@/lib/backend/me";
import { getSessionToken } from "./session";
import { ErrorCode } from "@/lib/backend/error";
import ProfileCard from "@/components/profile_card";
import { UserInfo } from "@/lib/backend/lib";
import { UserContext } from "@/components/user_provider";

export default function Home() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ info, setInfo ] = useState<UserInfo | null>(null);
  const { token } = useContext(UserContext)
  
  useEffect(() => {
    (async () => {
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
      
      setInfo(me.value)
      setLoading(false)
    })()
  }, [token]);
  
  var card = <ProfileCard userInfo={ info } isLoading={ loading } />
  if (!loading && error != null) {
    // Error occured
    card = <p>
      Sorry, there was an error while loading user profile: { error }
    </p>
  }
  
  return (
    <>
      { card }
      
      <p>
        URL for web is <a href={ WEB_URL }>{ WEB_URL }</a><br></br>
        URL for API is <a href={ API_URL }>{ API_URL }</a>
      </p>
    </>
  );
}
