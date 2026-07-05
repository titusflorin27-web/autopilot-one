import { createPageMetadata } from "../../lib/seo";
import { DemoRequestsClient } from "./DemoRequestsClient";

export const metadata = createPageMetadata({
  title: "Cereri demo Autopilot One",
  description: "Gestionarea cererilor demo, statusurilor și pașilor de follow-up pentru Autopilot One.",
  path: "/demo-requests",
  noIndex: true,
});


export default function DemoRequestsPage() {
  return (
    <main className="container page-stack">
      <DemoRequestsClient />
    </main>
  );
}
