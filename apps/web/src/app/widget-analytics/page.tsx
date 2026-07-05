import { createPageMetadata } from "../../lib/seo";
import { WidgetAnalyticsClient } from "./WidgetAnalyticsClient";

export const metadata = createPageMetadata({
  title: "Analitice widget Autopilot One",
  description: "Evenimente, vizitatori, conversații și semnale operaționale pentru widgetul AI.",
  path: "/widget-analytics",
  noIndex: true,
});


export default function WidgetAnalyticsPage() {
  return (
    <main className="container page-stack">
      <WidgetAnalyticsClient />
    </main>
  );
}
