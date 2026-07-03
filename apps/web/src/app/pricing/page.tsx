import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = createPageMetadata({
  title: "Prețuri Autopilot One",
  description:
    "Vezi pachetele Autopilot One pentru recepționer AI, widget pe website, captare leaduri, CRM Lite și automatizare ghidată pentru IMM-uri.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <Nav />
      <PricingClient />
      <Footer />
    </>
  );
}
