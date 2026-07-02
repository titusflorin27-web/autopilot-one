import Link from "next/link";
import { DashboardClient } from "./DashboardClient";

const navigationItems = [
  ["Panou", "/dashboard"],
  ["Cereri demo", "/demo-requests"],
  ["Lansare", "/launch"],
  ["Facturare", "/billing"],
  ["Notificări", "/notifications"],
  ["Inbox", "/inbox"],
  ["Profil companie", "/onboarding"],
  ["Bază de cunoștințe", "/knowledge-base"],
  ["Recepționer AI", "/reception-ai"],
  ["Demo widget", "/widget-demo"],
  ["Setări widget", "/widget-settings"],
  ["Analitice widget", "/widget-analytics"],
];

export default function DashboardPage() {
  return (
    <main className="dashboard dashboard-premium">
      <aside className="sidebar dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">A1</div>
          <div>
            <h3>Autopilot One</h3>
            <p>Centrul de comandă</p>
          </div>
        </div>

        <nav>
          {navigationItems.map(([label, href]) => (
            <Link key={href} href={href} className={href === "/dashboard" ? "active" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="main dashboard-main">
        <DashboardClient />
      </section>
    </main>
  );
}
