import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autopilot One",
  description: "Angajați AI pentru companii moderne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
