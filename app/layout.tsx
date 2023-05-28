import "./globals.css";
import LayoutClient from "./LayoutClient";
import Image from "next/image";
import NextAuthSessionProvider from "./NextAuthSessionProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import Header from "./(navigation)/Header";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <ReactQueryProvider>
        <html lang="en">
          <head />
          <LayoutClient>{children}</LayoutClient>
          <ReactQueryDevtools />
        </html>
      </ReactQueryProvider>
    </NextAuthSessionProvider>
  );
}
