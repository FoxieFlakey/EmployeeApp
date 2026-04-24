import Header from "@/components/header";
import "./globals.css";

import styles from "./page.module.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className={ styles.content }>{children}</div>
        <div className={ styles.filler } />
      </body>
    </html>
  );
}

