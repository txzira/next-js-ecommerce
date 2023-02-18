import "./globals.css";
import ClientProviders from "./ClientProivders";

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
