'use client'

import StyledButton from "./button"
import { redirect } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Centered from "./centered"
import { UserContext } from "./user_provider"
import styles from "./side_menu.module.css"
import { AppContext, Page } from "@/app/page"

function NavBarItem({ children, page }: { children?: ReactNode, page: Page }) {
  const { currentPage, setPage } = useContext(AppContext)
  var classes = styles.navbar_item
  
  if (currentPage == page) {
    classes += ` ${styles.navbar_current}`
  }
  
  return <button onClick={ () => setPage(page) } className={ classes }>
    { children }
  </button>
}

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
  
  var homeMenu = null
  if (isLoggedIn) {
    homeMenu = <NavBarItem page={ Page.HomePage }>Home</NavBarItem>
  }
  
  return <>
    <div style={{ marginBottom: "3px" }}>
      { homeMenu }
    </div>
    
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

