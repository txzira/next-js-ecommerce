import "./globals.css";
import ClientProviders from "./ClientProivders";
import Image from "next/image";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
