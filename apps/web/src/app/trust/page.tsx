import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";
import { TrustPageClient } from "./TrustPageClient";

export const metadata: Metadata = createPageMetadata({
  title: "Autopilot One — încredere, securitate și AI controlat",
  description:
    "Află cum Autopilot One gestionează datele, răspunsurile AI, widgetul, escalarea umană și lansarea controlată pentru companii B2B.",
  path: "/trust",
});

export default function TrustPage() {
  return (
    <>
      <Nav />
      <TrustPageClient />
      <Footer />
    </>
  );
}
