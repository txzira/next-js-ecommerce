import "./globals.css";
import NextAuthSessionProvider from "./NextAuthSessionProvider";
import Header from "./(navigation)/Header";
import { Toaster } from "react-hot-toast";
import Background from "./Background";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <html lang="en">
        <head />
        <body>
          <Toaster />
          <Header />
          <Background/>
          <main className="relative h-[calc(100vh_-_3.5rem)] md:h-[calc(100vh_-_3.5rem)] ">{children}</main>
        </body>
      </html>
    </NextAuthSessionProvider>
  );
}
