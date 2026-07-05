import { createPageMetadata } from "../../lib/seo";
import { BillingClient } from "./BillingClient";

export const metadata = createPageMetadata({
  title: "Facturare Autopilot One",
  description: "Pachete, limite, utilizare și acces la checkout sau portalul de facturare Autopilot One.",
  path: "/billing",
  noIndex: true,
});


export default function BillingPage() {
  return (
    <main className="container page-stack">
      <BillingClient />
    </main>
  );
}
