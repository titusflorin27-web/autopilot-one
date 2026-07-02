"use client";

import { useEffect, useState } from "react";

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

export function WidgetAnalyticsClient() {
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
      throw new Error("Please log in before viewing widget analytics.");
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
      throw new Error(data.message ?? "Could not load widget analytics");
    }

    setAnalytics(data);
  }

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("Please log in before viewing widget analytics.");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Could not load user session");
        }

        setUser(data);
        const membership = data.memberships?.[0] as Membership | undefined;

        if (membership) {
          await loadAnalytics(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Could not load widget analytics");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>Loading widget analytics...</p>;
  }

  if (error && !user) {
    return (
      <section className="card">
        <h1>Autentificare necesară.</h1>
        <p>{error}</p>
        <a href="/login" className="button">Mergi la login</a>
      </section>
    );
  }

  return (
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">Analitice widget</div>
        <h1>Starea instalării widgetului.</h1>
        <p>{primaryMembership ? `Workspace: ${primaryMembership.organization.name}` : "Nu a fost găsită nicio organizație."}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {analytics ? (
        <>
          <section className="grid">
            <article className="card">
              <h3>Config loaded</h3>
              <div className="metric">{analytics.installHealth.hasConfigLoad ? "Da" : "Nu"}</div>
            </article>
            <article className="card">
              <h3>Widget deschis</h3>
              <div className="metric">{analytics.events.OPENED ?? 0}</div>
            </article>
            <article className="card">
              <h3>Messages sent</h3>
              <div className="metric">{analytics.events.MESSAGE_SENT ?? 0}</div>
            </article>
          </section>

          <section className="grid">
            <article className="card">
              <h3>Public conversations</h3>
              <div className="metric">{analytics.publicFunnel.conversations}</div>
            </article>
            <article className="card">
              <h3>Public leads</h3>
              <div className="metric">{analytics.publicFunnel.leads}</div>
            </article>
            <article className="card">
              <h3>Follow-up tasks</h3>
              <div className="metric">{analytics.publicFunnel.tasks}</div>
            </article>
          </section>

          <section className="grid two-columns">
            <article className="card">
              <h2>Număr evenimente</h2>
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
              <h2>Domenii</h2>
              <div className="source-list">
                {Object.keys(analytics.domains).length ? Object.entries(analytics.domains).map(([domain, count]) => (
                  <div className="source-item" key={domain}>
                    <strong>{domain}</strong>
                    <span>{count} events</span>
                  </div>
                )) : <p>Nu domains detected yet.</p>}
              </div>
            </article>
          </section>

          <section className="card">
            <h2>Evenimente recente widget</h2>
            <div className="source-list">
              {analytics.recentEvents.length ? analytics.recentEvents.map((event) => (
                <div className="source-item" key={event.id}>
                  <strong>{event.type}</strong>
                  <span>{new Date(event.createdAt).toLocaleString()}</span>
                  {event.origin ? <span>Origin: {event.origin}</span> : null}
                  {event.websiteUrl ? <span>URL: {event.websiteUrl}</span> : null}
                  {event.visitorId ? <span>Visitor: {event.visitorId.slice(0, 18)}...</span> : null}
                  {event.conversationId ? <span>Conversation: {event.conversationId.slice(0, 10)}</span> : null}
                </div>
              )) : <p>Nu widget events yet.</p>}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
