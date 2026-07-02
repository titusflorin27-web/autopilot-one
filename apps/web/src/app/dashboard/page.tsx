"use client";

import Link from "next/link";
import { dashboardShellCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";
import { DashboardClient } from "./DashboardClient";

const navigationItems = [
  ["dashboard", "/dashboard"],
  ["demoRequests", "/demo-requests"],
  ["launch", "/launch"],
  ["billing", "/billing"],
  ["notifications", "/notifications"],
  ["inbox", "/inbox"],
  ["onboarding", "/onboarding"],
  ["knowledgeBase", "/knowledge-base"],
  ["receptionAi", "/reception-ai"],
  ["widgetDemo", "/widget-demo"],
  ["widgetSettings", "/widget-settings"],
  ["widgetAnalytics", "/widget-analytics"],
] as const;

export default function DashboardPage() {
  const copy = dashboardShellCopy[useAppLanguage()];

  return (
    <main className="dashboard dashboard-premium">
      <aside className="sidebar dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">A1</div>
          <div>
            <h3>Autopilot One</h3>
            <p>{copy.commandCenter}</p>
          </div>
        </div>

        <nav>
          {navigationItems.map(([key, href]) => (
            <Link key={href} href={href} className={href === "/dashboard" ? "active" : undefined}>
              {copy[key]}
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
