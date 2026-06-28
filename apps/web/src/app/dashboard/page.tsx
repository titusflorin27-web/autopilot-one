import Link from "next/link";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <h3>Autopilot One</h3>
        <p>Centrul de comandă</p>
        <nav>
          <Link href="/dashboard">Bord</Link>
          <Link href="/demo-requests">Cereri demo</Link>
          <Link href="/launch">Listă de verificare la lansări</Link>
          <Link href="/billing">Facturare</Link>
          <Link href="/notifications">Notificări</Link>
          <Link href="/inbox">Inbox</Link>
          <Link href="/onboarding">ADN-ul afacerilor</Link>
          <Link href="/knowledge-base">Baza de cunoștințe</Link>
          <Link href="/reception-ai">Recepție AI</Link>
          <Link href="/widget-demo">Widgetul site-ului web</Link>
          <Link href="/widget-settings">Setări widget</Link>
          <Link href="/widget-analytics">Analiză widget</Link>
        </nav>
      </aside>
      <section className="main">
        <DashboardClient />
      </section>
    </main>
  );
}
