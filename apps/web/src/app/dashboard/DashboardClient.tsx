"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type CurrentUser = {
  email: string;
  memberships: Array<{
    role: string;
    organization: {
      name: string;
      slug: string;
    };
  }>;
};

type DashboardMetric = {
  label: string;
  value: number;
  helper?: string;
  href?: string;
  ctaLabel?: string;
};

type DashboardTimelineEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  href?: string;
};

type DashboardMetrics = {
  metrics: DashboardMetric[];
  timeline: DashboardTimelineEvent[];
};

const quickActions = [
  {
    title: "Configurează widgetul",
    description: "Pregătește widgetul pentru site și verifică mesajul de întâmpinare.",
    href: "/widget-settings",
  },
  {
    title: "Completează profilul companiei",
    description: "Adaugă informațiile de bază pe care recepționerul AI le folosește în răspunsuri.",
    href: "/onboarding",
  },
  {
    title: "Verifică cererile demo",
    description: "Urmărește leadurile captate și pașii următori pentru fiecare conversație.",
    href: "/demo-requests",
  },
];

const launchSteps = [
  "Completează profilul companiei",
  "Adaugă baza de cunoștințe",
  "Configurează widgetul",
  "Testează fluxul din perspectiva clientului",
];

function formatMetric(value: number) {
  return new Intl.NumberFormat("ro-RO").format(value);
}

function formatDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Dată indisponibilă";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function formatRole(role?: string) {
  if (!role) {
    return "Membru";
  }

  const normalizedRole = role.toUpperCase();

  if (normalizedRole === "OWNER") {
    return "Owner";
  }

  if (normalizedRole === "ADMIN") {
    return "Admin";
  }

  return "Membru";
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  const content = (
    <>
      <div className="metric">{formatMetric(metric.value)}</div>
      <p>{metric.label}</p>
      {metric.helper ? <p className="helper-text">{metric.helper}</p> : null}
      {metric.ctaLabel ? <span className="card-link-label">{metric.ctaLabel} →</span> : null}
    </>
  );

  if (metric.href) {
    return <Link className="card metric-card dashboard-metric-card" href={metric.href}>{content}</Link>;
  }

  return <article className="card metric-card dashboard-metric-card">{content}</article>;
}

function TimelineItem({ item }: { item: DashboardTimelineEvent }) {
  const content: ReactNode = (
    <>
      <strong>{item.title}</strong>
      <span>{formatDate(item.createdAt)}</span>
      <p>{item.description}</p>
      {item.href ? <span className="card-link-label">Deschide detalii →</span> : null}
    </>
  );

  if (item.href) {
    return <Link className="source-item timeline-link dashboard-timeline-item" href={item.href}>{content}</Link>;
  }

  return <article className="source-item dashboard-timeline-item">{content}</article>;
}

export function DashboardClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];
  const timeline = useMemo(() => dashboard?.timeline ?? [], [dashboard]);
  const metrics = dashboard?.metrics ?? [];

  useEffect(() => {
    const accessToken = window.localStorage.getItem("autopilot.accessToken");

    if (!accessToken) {
      setIsLoading(false);
      setError("Autentifică-te pentru a accesa centrul de comandă.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    Promise.all([
      fetch(`${API_URL}/users/me`, { headers }),
      fetch(`${API_URL}/dashboard/metrics`, { headers }),
    ])
      .then(async ([userResponse, dashboardResponse]) => {
        const userData = await userResponse.json();
        const dashboardData = await dashboardResponse.json();

        if (!userResponse.ok) {
          throw new Error(userData.message ?? "Sesiunea a expirat");
        }

        if (!dashboardResponse.ok) {
          throw new Error(dashboardData.message ?? "Nu am putut încărca metricile dashboardului");
        }

        setUser(userData);
        setDashboard(dashboardData);
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Sesiunea a expirat");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="card dashboard-loading-card">
        <div className="eyebrow">Dashboard</div>
        <h1>Se încarcă centrul de comandă...</h1>
        <p>Pregătim datele workspace-ului și ultimele evenimente.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card dashboard-error-card">
        <div className="eyebrow">Acces securizat</div>
        <h1>Autentificare necesară.</h1>
        <p>{error}</p>
        <Link href="/login" className="button">Mergi la login</Link>
      </section>
    );
  }

  return (
    <>
      <section className="dashboard-hero-card">
        <div>
          <div className="eyebrow">Dashboard operațional</div>
          <h1>Centrul de comandă este activ.</h1>
          <p>
            Conectat ca <strong>{user?.email}</strong>
            {primaryMembership ? ` · ${primaryMembership.organization.name} · ${formatRole(primaryMembership.role)}` : null}
          </p>
        </div>

        <div className="dashboard-status-grid" aria-label="Stare workspace">
          <div>
            <span>Workspace</span>
            <strong>{primaryMembership?.organization.name ?? "Activ"}</strong>
          </div>
          <div>
            <span>Sesiune</span>
            <strong>Conectată</strong>
          </div>
          <div>
            <span>Rol</span>
            <strong>{formatRole(primaryMembership?.role)}</strong>
          </div>
        </div>
      </section>

      <section className="grid dashboard-metrics-grid">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="dashboard-action-grid">
        {quickActions.map((action) => (
          <Link href={action.href} className="card dashboard-action-card" key={action.href}>
            <span>Pas recomandat</span>
            <strong>{action.title}</strong>
            <p>{action.description}</p>
            <em>Deschide →</em>
          </Link>
        ))}
      </section>

      <section className="dashboard-two-column">
        <article className="card dashboard-timeline-card">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow">Activitate recentă</div>
              <h2>Ultimele evenimente</h2>
            </div>
          </div>

          <div className="source-list">
            {timeline.length > 0 ? (
              timeline.map((item) => <TimelineItem item={item} key={`${item.type}-${item.id}`} />)
            ) : (
              <div className="dashboard-empty-state">
                <strong>Nu există evenimente recente încă.</strong>
                <p>
                  După ce apar cereri demo, conversații sau actualizări importante,
                  acestea vor fi listate aici.
                </p>
              </div>
            )}
          </div>
        </article>

        <article className="card dashboard-launch-card">
          <div className="eyebrow">Lansare</div>
          <h2>Checklist minim</h2>
          <p>Pașii esențiali pentru ca Autopilot One să fie pregătit pentru clienți.</p>

          <ol>
            {launchSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <Link href="/launch" className="button">Vezi checklistul complet</Link>
        </article>
      </section>
    </>
  );
}
