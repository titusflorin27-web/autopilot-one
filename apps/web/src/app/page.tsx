import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { HomeContent } from "../components/HomeContent";
import { Nav } from "../components/Nav";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Autopilot One — AI Website Agent și CRM Lite pentru IMM-uri",
  description:
    "Transformă website-ul într-un flux AI controlat: agent AI pentru vizitatori, captare leaduri, CRM Lite, knowledge base și automatizare cu aprobări umane.",
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
