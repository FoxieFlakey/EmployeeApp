import Header from "@/components/header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Employee App</title>
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

