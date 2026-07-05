import { createPageMetadata } from "../../lib/seo";
import { InboxClient } from "./InboxClient";

export const metadata = createPageMetadata({
  title: "Inbox Autopilot One",
  description: "Inbox pentru conversații, transferuri umane și răspunsuri operator în Autopilot One.",
  path: "/inbox",
  noIndex: true,
});


export default function InboxPage() {
  return (
    <main className="container page-stack">
      <InboxClient />
    </main>
  );
}
