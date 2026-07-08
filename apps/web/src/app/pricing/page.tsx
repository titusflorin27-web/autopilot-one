import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = createPageMetadata({
  title: "Prețuri Autopilot One",
  description:
    "Vezi pachetele Autopilot One pentru recepționer AI, widget pe website, captare leaduri, CRM Lite și activare comercială controlată după demo.",
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
