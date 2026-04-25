'use client';

import { useContext, useState } from "react";
import { API_URL, WEB_URL } from "@/app/config";
import ProfileCard from "@/components/profile_card";
import { UserContext } from "@/components/user_provider";
import AddUseForm, { AddUserDetail } from "@/components/add_user_form";
import ModalWindow from "@/components/modal_window";

export default function Home() {
  const { token, userInfo } = useContext(UserContext)
  
  const info = userInfo?.ok ? userInfo?.value : null
  var card = <ProfileCard userInfo={ info } isLoading={ userInfo == null } />
  if (userInfo != null && !userInfo.ok) {
    // Error occured
    card = <p>
      Sorry, there was an error while loading user profile: { userInfo.value.message }
    </p>
  }
  
  if (token == null) {
    card = <p>
      You're not logged in please login
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
