import "./globals.css";
import "./launch.css";
import type { Metadata, Viewport } from "next";
import { createPageMetadata, siteConfig } from "../lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    "Autopilot One",
    "angajat AI",
    "recepție AI",
    "widget AI",
    "captare lead-uri",
    "CRM Lite",
    "automatizare IMM",
    "asistent AI website",
  ],
  category: "business software",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  manifest: "/manifest.webmanifest",
  ...createPageMetadata({
    title: "Autopilot One — angajați AI pentru IMM-uri",
    description:
      "Autopilot One ajută IMM-urile să capteze lead-uri, să răspundă vizitatorilor 24/7 și să urmărească cererile într-un CRM simplu.",
    path: "/",
  }),
  title: {
    default: "Autopilot One — angajați AI pentru IMM-uri",
    template: "%s | Autopilot One",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
