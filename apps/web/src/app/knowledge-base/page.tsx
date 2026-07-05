import { createPageMetadata } from "../../lib/seo";
import { KnowledgeBaseClient } from "./KnowledgeBaseClient";

export const metadata = createPageMetadata({
  title: "Bază de cunoștințe Autopilot One",
  description: "Surse de cunoștințe, website-uri, fișiere și căutare pentru Recepționerul AI.",
  path: "/knowledge-base",
  noIndex: true,
});


export default function KnowledgeBasePage() {
  return (
    <main className="container page-stack">
      <KnowledgeBaseClient />
    </main>
  );
}
