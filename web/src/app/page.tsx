'use client'

import styles from "./page.module.css"
import SideMenu from "@/components/side_menu"
import UserProvider from "@/components/user_provider"

import Home from "@/pages/home"
import Users from "@/pages/users"
import { createContext, useState } from "react";

interface AppContext {
  currentPage: Page,
  setPage(page: Page): void
}

export enum Page {
  HomePage,
  UsersList
}

export const AppContext = createContext<AppContext>({
  currentPage: Page.HomePage,
  setPage(_) {}
});

export default function App() {
  const [ currentPage, setCurrentPage ] = useState(Page.HomePage)
  let page = <></>
  
  switch (currentPage) {
  case Page.HomePage:
    page = <Home />
    break
  case Page.UsersList:
    page = <Users />
    break
  }
  
  return <AppContext.Provider value={{ currentPage, setPage: setCurrentPage }}>
    <UserProvider>
      <table className={ styles.dividerTable }><tbody><tr>
        <td className={ styles.sideMenu }>
          <SideMenu />
        </td>
        
        <td className={ styles.content }>
          { page }
        </td>
      </tr></tbody></table>
    </UserProvider>
  </AppContext.Provider>
}

