"use client";

import { useEffect, useState } from "react";
import { widgetPagesCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type Membership = {
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
};

type CurrentUser = {
  email: string;
  memberships: Membership[];
};

type WidgetAnalytics = {
  windowDays: number;
  installHealth: {
    hasConfigLoad: boolean;
    hasWidgetLoad: boolean;
    hasWidgetOpen: boolean;
    hasMessageSent: boolean;
    lastEventAt?: string | null;
  };
  events: Record<string, number>;
  publicFunnel: {
    conversations: number;
    messages: number;
    leads: number;
    tasks: number;
  };
  domains: Record<string, number>;
  recentEvents: Array<{
    id: string;
    type: string;
    visitorId?: string | null;
    conversationId?: string | null;
    websiteUrl?: string | null;
    origin?: string | null;
    createdAt: string;
  }>;
};

type AnalyticsCopy = typeof widgetPagesCopy["ro"]["analytics"];

function formatDate(value: string, locale: string, copy: AnalyticsCopy) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return copy.dateUnavailable;
  }

  return parsedDate.toLocaleString(locale);
}

export function WidgetAnalyticsClient() {
  const language = useAppLanguage();
  const copy = widgetPagesCopy[language].analytics;
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [analytics, setAnalytics] = useState<WidgetAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];

  function getAccessToken() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function apiFetch(path: string, init: RequestInit = {}) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error(copy.loginRequired);
    }

    return fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  }

  async function loadAnalytics(organizationId: string) {
    const response = await apiFetch(`/reception-ai/organization/${organizationId}/widget-analytics`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? copy.loadAnalyticsError);
    }

    setAnalytics(data);
  }

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError(copy.loginRequired);
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? copy.loadSessionError);
        }

        setUser(data);
        const membership = data.memberships?.[0] as Membership | undefined;

        if (membership) {
          await loadAnalytics(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : copy.loadAnalyticsError);
      })
      .finally(() => setIsLoading(false));
  }, [copy.loadAnalyticsError, copy.loadSessionError, copy.loginRequired]);

  if (isLoading) {
    return (
      <section className="card protected-loading-card">
        <div className="eyebrow">Se încarcă</div>
        <h1>Analitice widget</h1>
        <p>{copy.loading}</p>
        <p className="helper-text">Pregătim evenimentele, domeniile și activitatea widgetului.</p>
      </section>
    );
  }

  if (error && !user) {
    return (
      <section className="card">
        <h1>{copy.authTitle}</h1>
        <p>{error}</p>
        <a href="/login" className="button">{copy.loginCta}</a>
      </section>
    );
  }

  return (
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>{primaryMembership ? `${copy.workspacePrefix}: ${primaryMembership.organization.name}` : copy.organizationMissing}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {analytics ? (
        <>
          <section className="grid">
            <article className="card">
              <h3>{copy.configLoaded}</h3>
              <div className="metric">{analytics.installHealth.hasConfigLoad ? copy.yes : copy.no}</div>
            </article>
            <article className="card">
              <h3>{copy.widgetOpened}</h3>
              <div className="metric">{analytics.events.OPENED ?? 0}</div>
            </article>
            <article className="card">
              <h3>{copy.messagesSent}</h3>
              <div className="metric">{analytics.events.MESSAGE_SENT ?? 0}</div>
            </article>
          </section>

          <section className="grid">
            <article className="card">
              <h3>{copy.publicConversations}</h3>
              <div className="metric">{analytics.publicFunnel.conversations}</div>
            </article>
            <article className="card">
              <h3>{copy.publicLeads}</h3>
              <div className="metric">{analytics.publicFunnel.leads}</div>
            </article>
            <article className="card">
              <h3>{copy.followUpTasks}</h3>
              <div className="metric">{analytics.publicFunnel.tasks}</div>
            </article>
          </section>

          <section className="grid two-columns">
            <article className="card">
              <h2>{copy.eventCounts}</h2>
              <div className="source-list">
                {Object.entries(analytics.events).map(([name, count]) => (
                  <div className="source-item" key={name}>
                    <strong>{name}</strong>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="card">
              <h2>{copy.domains}</h2>
              <div className="source-list">
                {Object.keys(analytics.domains).length ? Object.entries(analytics.domains).map(([domain, count]) => (
                  <div className="source-item" key={domain}>
                    <strong>{domain}</strong>
                    <span>{count} {copy.events}</span>
                  </div>
                )) : <p>{copy.noDomains}</p>}
              </div>
            </article>
          </section>

          <section className="card">
            <h2>{copy.recentEvents}</h2>
            <div className="source-list">
              {analytics.recentEvents.length ? analytics.recentEvents.map((event) => (
                <div className="source-item" key={event.id}>
                  <strong>{event.type}</strong>
                  <span>{formatDate(event.createdAt, locale, copy)}</span>
                  {event.origin ? <span>{copy.origin}: {event.origin}</span> : null}
                  {event.websiteUrl ? <span>URL: {event.websiteUrl}</span> : null}
                  {event.visitorId ? <span>{copy.visitor}: {event.visitorId.slice(0, 18)}...</span> : null}
                  {event.conversationId ? <span>{copy.conversation}: {event.conversationId.slice(0, 10)}</span> : null}
                </div>
              )) : <p>{copy.noRecentEvents}</p>}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
