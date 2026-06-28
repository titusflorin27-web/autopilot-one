import "./globals.css";
import "./launch.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.autopilot-one.com"),
  title: {
    default: "Autopilot One — angajați AI pentru IMM-uri",
    template: "%s | Autopilot One",
  },
  description: "Autopilot One ajută IMM-urile să capteze lead-uri, să răspundă vizitatorilor 24/7 și să urmărească cererile într-un CRM simplu.",
  openGraph: {
    title: "Autopilot One — angajați AI pentru IMM-uri",
    description: "Widget AI, captare lead-uri, inbox și CRM Lite pentru afaceri mici și medii.",
    url: "https://app.autopilot-one.com",
    siteName: "Autopilot One",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
