'use client'

import styles from "./page.module.css"
import SideMenu from "@/components/side_menu"
import UserProvider from "@/components/user_provider"

import Home from "@/pages/home"
import { createContext, useState } from "react";

interface AppContext {
  currentPage: Page,
  setPage(page: Page): void
}

export enum Page {
  HomePage
}

export const AppContext = createContext<AppContext>({
  currentPage: Page.HomePage,
  setPage(_) {}
});

export default function App() {
  const [ currentPage, setCurrentPage ] = useState(Page.HomePage)
  
  return <AppContext.Provider value={{ currentPage, setPage: setCurrentPage }}>
    <UserProvider>
      <table className={ styles.dividerTable }><tbody><tr>
        <td className={ styles.sideMenu }>
          <SideMenu />
        </td>
        
        <td className={ styles.content }>
          <Home />
        </td>
      </tr></tbody></table>
    </UserProvider>
  </AppContext.Provider>
}

