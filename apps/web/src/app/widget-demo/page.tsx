import type { Metadata } from "next";
import { createPageMetadata } from "../../lib/seo";
import { WidgetDemoClient } from "./WidgetDemoClient";

export const metadata: Metadata = createPageMetadata({
  title: "Demo widget AI Autopilot One",
  description:
    "Testează demo-ul widgetului AI Autopilot One pentru recepție web, răspunsuri 24/7 și captare lead-uri.",
  path: "/widget-demo",
});

export default function WidgetDemoPage() {
  return (
    <main className="container page-stack">
      <WidgetDemoClient />
    </main>
  );
}
