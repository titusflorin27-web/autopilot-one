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
        </nav>
      </aside>
      <section className="main">
        <DashboardClient />
      </section>
    </main>
  );
}
