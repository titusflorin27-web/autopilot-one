"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { dashboardContentCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

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

type DashboardContentCopy = typeof dashboardContentCopy["ro"];

function formatMetric(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

function formatDate(value: string, locale: string, unavailableLabel: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return unavailableLabel;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function formatRole(role: string | undefined, copy: DashboardContentCopy) {
  if (!role) {
    return copy.memberRole;
  }

  const normalizedRole = role.toUpperCase();

  if (normalizedRole === "OWNER") {
    return copy.ownerRole;
  }

  if (normalizedRole === "ADMIN") {
    return copy.adminRole;
  }

  return copy.memberRole;
}

function MetricCard({ metric, locale }: { metric: DashboardMetric; locale: string }) {
  const content = (
    <>
      <div className="metric">{formatMetric(metric.value, locale)}</div>
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

function TimelineItem({ item, locale, copy }: { item: DashboardTimelineEvent; locale: string; copy: DashboardContentCopy }) {
  const content: ReactNode = (
    <>
      <strong>{item.title}</strong>
      <span>{formatDate(item.createdAt, locale, copy.dateUnavailable)}</span>
      <p>{item.description}</p>
      {item.href ? <span className="card-link-label">{copy.openDetails}</span> : null}
    </>
  );

  if (item.href) {
    return <Link className="source-item timeline-link dashboard-timeline-item" href={item.href}>{content}</Link>;
  }

  return <article className="source-item dashboard-timeline-item">{content}</article>;
}

export function DashboardClient() {
  const language = useAppLanguage();
  const copy = dashboardContentCopy[language];
  const locale = language === "ro" ? "ro-RO" : "en-US";

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
      setError(copy.authError);
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
          throw new Error(userData.message ?? copy.sessionExpired);
        }

        if (!dashboardResponse.ok) {
          throw new Error(dashboardData.message ?? copy.metricsError);
        }

        setUser(userData);
        setDashboard(dashboardData);
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : copy.sessionExpired);
      })
      .finally(() => setIsLoading(false));
  }, [copy.authError, copy.metricsError, copy.sessionExpired]);

  if (isLoading) {
    return (
      <section className="card dashboard-loading-card">
        <div className="eyebrow">{copy.loadingEyebrow}</div>
        <h1>{copy.loadingTitle}</h1>
        <p>{copy.loadingBody}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card dashboard-error-card">
        <div className="eyebrow">{copy.authEyebrow}</div>
        <h1>{copy.authTitle}</h1>
        <p>{error}</p>
        <Link href="/login" className="button">{copy.loginCta}</Link>
      </section>
    );
  }

  return (
    <>
      <section className="dashboard-hero-card">
        <div>
          <div className="eyebrow">{copy.heroEyebrow}</div>
          <h1>{copy.heroTitle}</h1>
          <p>
            {copy.connectedAs} <strong>{user?.email}</strong>
            {primaryMembership ? ` · ${primaryMembership.organization.name} · ${formatRole(primaryMembership.role, copy)}` : null}
          </p>
        </div>

        <div className="dashboard-status-grid" aria-label={copy.statusAria}>
          <div>
            <span>{copy.workspaceLabel}</span>
            <strong>{primaryMembership?.organization.name ?? copy.activeFallback}</strong>
          </div>
          <div>
            <span>{copy.sessionLabel}</span>
            <strong>{copy.connectedLabel}</strong>
          </div>
          <div>
            <span>{copy.roleLabel}</span>
            <strong>{formatRole(primaryMembership?.role, copy)}</strong>
          </div>
        </div>
      </section>

      <section className="grid dashboard-metrics-grid">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} locale={locale} />)}
      </section>

      <section className="dashboard-action-grid">
        {copy.quickActions.map((action) => (
          <Link href={action.href} className="card dashboard-action-card" key={action.href}>
            <span>{copy.recommendedStep}</span>
            <strong>{action.title}</strong>
            <p>{action.description}</p>
            <em>{copy.openCta}</em>
          </Link>
        ))}
      </section>

      <section className="dashboard-two-column">
        <article className="card dashboard-timeline-card">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow">{copy.recentEyebrow}</div>
              <h2>{copy.recentTitle}</h2>
            </div>
          </div>

          <div className="source-list">
            {timeline.length > 0 ? (
              timeline.map((item) => <TimelineItem item={item} key={`${item.type}-${item.id}`} locale={locale} copy={copy} />)
            ) : (
              <div className="dashboard-empty-state">
                <strong>{copy.emptyTitle}</strong>
                <p>{copy.emptyBody}</p>
              </div>
            )}
          </div>
        </article>

        <article className="card dashboard-launch-card">
          <div className="eyebrow">{copy.launchEyebrow}</div>
          <h2>{copy.checklistTitle}</h2>
          <p>{copy.checklistBody}</p>

          <ol>
            {copy.launchSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <Link href="/launch" className="button">{copy.fullChecklistCta}</Link>
        </article>
      </section>
    </>
  );
}
