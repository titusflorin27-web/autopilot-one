import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { HomeContent } from "../components/HomeContent";
import { Nav } from "../components/Nav";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Autopilot One — angajați AI pentru IMM-uri",
  description:
    "Adaugă pe website un angajat AI care răspunde vizitatorilor, captează lead-uri și trimite conversațiile importante în CRM Lite.",
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
