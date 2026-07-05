import { createPageMetadata } from "../../lib/seo";
import { WidgetSettingsClient } from "./WidgetSettingsClient";

export const metadata = createPageMetadata({
  title: "Setări widget Autopilot One",
  description: "Configurarea widgetului AI: titlu, culoare, poziție, token și origini permise.",
  path: "/widget-settings",
  noIndex: true,
});


export default function WidgetSettingsPage() {
  return (
    <main className="container page-stack">
      <WidgetSettingsClient />
    </main>
  );
}
