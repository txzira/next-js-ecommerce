"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Header from "./(navigation)/Header";
// import CartProvider from "./CartProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <Toaster />
        <Header />
        <main className="md:h-[calc(100vh_-_3.5rem)]">{children}</main>
      </SessionProvider>
    </>
  );
}
