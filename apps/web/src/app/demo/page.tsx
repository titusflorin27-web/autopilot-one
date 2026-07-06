import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";
import { DemoPageClient } from "./DemoPageClient";

export const metadata: Metadata = createPageMetadata({
  title: "Autopilot One demo",
  description:
    "Autopilot One demo request page for AI reception, lead capture, CRM Lite and guided implementation.",
  path: "/demo",
});

export default function DemoPage() {
  return (
    <>
      <Nav />
      <DemoPageClient />
      <Footer />
    </>
  );
}
