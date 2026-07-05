import { createPageMetadata } from "../../lib/seo";
import { ReceptionAiClient } from "./ReceptionAiClient";

export const metadata = createPageMetadata({
  title: "Recepționer AI Autopilot One",
  description: "Conversații, lead-uri, taskuri și testare operațională pentru Recepționerul AI.",
  path: "/reception-ai",
  noIndex: true,
});


export default function ReceptionAiPage() {
  return (
    <main className="container page-stack">
      <ReceptionAiClient />
    </main>
  );
}
