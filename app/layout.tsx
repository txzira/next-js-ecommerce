import "./globals.css";
import NextAuthSessionProvider from "./NextAuthSessionProvider";
import Header from "./(navigation)/Header";
import { Toaster } from "react-hot-toast";
import Background from "./Background";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export const metadata: Metadata = {
  title: "Next js ecommerce",
  description: "Modern ecommerce application using nextjs and prisma",
  creator: "Ronnie Ayers",
  generator: "Next.js",
};

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
          <Background />
          <main className="relative h-[calc(100vh_-_3.5rem)] md:h-[calc(100vh_-_3.5rem)] ">
            {children}
          </main>
        </body>
      </html>
    </NextAuthSessionProvider>
  );
}
