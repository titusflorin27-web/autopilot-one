import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { HomeContent } from "../components/HomeContent";
import { Nav } from "../components/Nav";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Autopilot One — AI receptionist and CRM Lite for SMBs",
  description:
    "Add an AI employee to your website that answers visitors, captures leads and sends important conversations into CRM Lite.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Nav />
      <HomeContent />
      <Footer />
    </>
  );
}
