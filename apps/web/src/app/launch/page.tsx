import { createPageMetadata } from "../../lib/seo";
import { LaunchClient } from "./LaunchClient";

export const metadata = createPageMetadata({
  title: "Checklist lansare Autopilot One",
  description: "Pașii necesari pentru configurarea și validarea operațională Autopilot One.",
  path: "/launch",
  noIndex: true,
});


export default function LaunchPage() {
  return (
    <main className="container page-stack">
      <LaunchClient />
    </main>
  );
}
