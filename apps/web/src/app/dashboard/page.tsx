import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <h3>Autopilot One</h3>
        <p>Command Center</p>
      </aside>
      <section className="main">
        <DashboardClient />
      </section>
    </main>
  );
}
