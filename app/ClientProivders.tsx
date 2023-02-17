"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Header from "./(navigation)/Header";
import CartProvider from "./CartProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <CartProvider>
          <Toaster />
          <Header />
          {children}
        </CartProvider>
      </SessionProvider>
    </>
  );
}
