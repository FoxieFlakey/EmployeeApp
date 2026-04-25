import Header from "@/components/header";
import "./globals.css";

import styles from "./page.module.css"
import SideMenu from "@/components/side_menu";
import UserProvider from "@/components/user_provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          
          <table className={ styles.dividerTable }><tbody><tr>
            <td className={ styles.sideMenu }>
              <SideMenu />
            </td>
            <td className={ styles.content }>
              {children}
            </td>
          </tr></tbody></table>
        </UserProvider>
      </body>
    </html>
  );
}

