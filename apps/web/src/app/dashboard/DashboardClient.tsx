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

function formatMetric(value: number) {
  return new Intl.NumberFormat("ro-RO").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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
    return <Link className="card metric-card" href={metric.href}>{content}</Link>;
  }

  return <article className="card metric-card">{content}</article>;
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
    return <Link className="source-item timeline-link" href={item.href}>{content}</Link>;
  }

  return <article className="source-item">{content}</article>;
}

export function DashboardClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];
  const timeline = useMemo(() => dashboard?.timeline ?? [], [dashboard]);

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
    return <p>Se încarcă centrul de comandă...</p>;
  }

  if (error) {
    return (
      <section className="card">
        <h1>Autentificare necesară.</h1>
        <p>{error}</p>
        <Link href="/login" className="button">Mergi la login</Link>
      </section>
    );
  }

  return (
    <>
      <div className="eyebrow">Cronologie de afaceri</div>
      <h1>Compania dumneavoastră este în funcțiune.</h1>
      <p>
        Conectat ca {user?.email}
        {primaryMembership ? ` · ${primaryMembership.organization.name} · ${primaryMembership.role}` : null}
      </p>

      <section className="grid">
        {dashboard?.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="card">
        <h2>Ultimele evenimente</h2>
        <div className="source-list">
          {timeline.map((item) => <TimelineItem item={item} key={`${item.type}-${item.id}`} />)}
        </div>
      </section>
    </>
  );
}
