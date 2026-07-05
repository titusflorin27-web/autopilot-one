import { createPageMetadata } from "../../lib/seo";
import { DashboardShellClient } from "./DashboardShellClient";

export const metadata = createPageMetadata({
  title: "Dashboard Autopilot One",
  description: "Centrul de comandă pentru conversații, lead-uri, activitate widget și pașii operaționali Autopilot One.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardShellClient />;
}
