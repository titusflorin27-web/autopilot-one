import { createPageMetadata } from "../../lib/seo";
import { NotificationsClient } from "./NotificationsClient";

export const metadata = createPageMetadata({
  title: "Notificări Autopilot One",
  description: "Notificări operaționale pentru conversații, lead-uri, taskuri și activitate Autopilot One.",
  path: "/notifications",
  noIndex: true,
});


export default function NotificationsPage() {
  return (
    <main className="container page-stack">
      <NotificationsClient />
    </main>
  );
}
