"use client";
import { Toaster } from "react-hot-toast";
import Header from "./(navigation)/Header";
import "./globals.css";
import ClientProviders from "./SessionProivder";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ClientProviders>
          <Toaster />
          <Header />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
