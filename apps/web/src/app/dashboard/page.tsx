import Link from "next/link";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <h3>Autopilot One</h3>
        <p>Command Center</p>
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/onboarding">Business DNA</Link>
          <Link href="/knowledge-base">Knowledge Base</Link>
          <Link href="/reception-ai">Reception AI</Link>
          <Link href="/widget-demo">Website Widget</Link>
          <Link href="/widget-settings">Widget Settings</Link>
          <Link href="/widget-analytics">Widget Analytics</Link>
        </nav>
      </aside>
      <section className="main">
        <DashboardClient />
      </section>
    </main>
  );
}
