import { ReactNode } from "react"
import styles from "./page.module.css"
import SideMenu from "@/components/side_menu"
import UserProvider from "@/components/user_provider"

import Home from "@/pages/home"

export default function App() {
  return <UserProvider>
    <table className={ styles.dividerTable }><tbody><tr>
      <td className={ styles.sideMenu }>
        <SideMenu />
      </td>
      
      <td className={ styles.content }>
        <Home />
      </td>
    </tr></tbody></table>
  </UserProvider>
}

