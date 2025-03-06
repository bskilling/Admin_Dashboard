import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./ClientProvider";
import Protected from "./hooks/useProtected";
// import { ClientProviders } from "./ClientProviders"; // Create this separately

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Bskilling Admin Dashboard",
  icons: {
    icon: "/favicon.ico", // Default favicon
    apple: "/apple-touch-icon.png", // Apple devices
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
