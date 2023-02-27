import "./globals.css";
import ClientProviders from "./ClientProivders";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="w-screen h-screen">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
