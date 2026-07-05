"use client";

import { useEffect, useState } from "react";
import { notificationsInboxCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type Membership = { organization: { id: string; name: string } };
type CurrentUser = { memberships: Membership[] };
type NotificationItem = {
  id: string;
  type: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
  href: string;
  createdAt: string;
};
type NotificationResponse = {
  total: number;
  highPriority: number;
  items: NotificationItem[];
  emailReady: Array<{ subject: string; preview: string; href: string }>;
};

type NotificationsCopy = typeof notificationsInboxCopy["ro"]["notifications"];

function formatDate(value: string, locale: string, copy: NotificationsCopy) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return copy.dateUnavailable;
  }

  return parsedDate.toLocaleString(locale);
}

export function NotificationsClient() {
  const language = useAppLanguage();
  const copy = notificationsInboxCopy[language].notifications;
  const commonCopy = notificationsInboxCopy[language].common;
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organization = user?.memberships[0]?.organization;

  function token() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function loadNotifications(organizationId: string) {
    const accessToken = token();
    if (!accessToken) throw new Error(copy.loginRequired);

    const response = await fetch(`${API_URL}/notifications/organization/${organizationId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const json = await response.json();

    if (!response.ok) throw new Error(json.message ?? copy.loadNotificationsError);
    setData(json);
  }

  useEffect(() => {
    const accessToken = token();

    if (!accessToken) {
      setError(copy.loginRequired);
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.message ?? copy.loadSessionError);
        setUser(json);
        const primary = json.memberships?.[0]?.organization;
        if (primary) await loadNotifications(primary.id);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : copy.loadNotificationsError))
      .finally(() => setIsLoading(false));
  }, [copy.loadNotificationsError, copy.loadSessionError, copy.loginRequired]);

  if (isLoading) {
    return (
      <section className="card protected-loading-card">
        <div className="eyebrow">Se încarcă</div>
        <h1>Notificări</h1>
        <p>{copy.loading}</p>
        <p className="helper-text">Pregătim notificările și evenimentele operaționale.</p>
      </section>
    );
  }

  if (error && !user) {
    return (
      <section className="card">
        <h1>{commonCopy.authTitle}</h1>
        <p>{error}</p>
        <a href="/login" className="button">{commonCopy.loginCta}</a>
      </section>
    );
  }

  return (
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>{organization ? `${copy.workspacePrefix}: ${organization.name}` : copy.organizationMissing}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {data ? (
        <>
          <section className="grid">
            <article className="card"><h3>{copy.total}</h3><div className="metric">{data.total.toLocaleString(locale)}</div></article>
            <article className="card"><h3>{copy.highPriority}</h3><div className="metric">{data.highPriority.toLocaleString(locale)}</div></article>
            <article className="card"><h3>{copy.emailReady}</h3><div className="metric">{data.emailReady.length.toLocaleString(locale)}</div></article>
          </section>

          <section className="grid two-columns">
            <article className="card">
              <h2>{copy.activeNotifications}</h2>
              <div className="source-list">
                {data.items.length ? data.items.map((item) => (
                  <a className="source-item" href={item.href} key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.type} · {item.priority} · {formatDate(item.createdAt, locale, copy)}</span>
                    <p>{item.description}</p>
                  </a>
                )) : <p>{copy.noActiveNotifications}</p>}
              </div>
            </article>

            <article className="card">
              <h2>{copy.emailPayloadsTitle}</h2>
              <div className="source-list">
                {data.emailReady.length ? data.emailReady.map((item, index) => (
                  <div className="source-item" key={`${item.subject}-${index}`}>
                    <strong>{item.subject}</strong>
                    <span>{item.href}</span>
                    <p>{item.preview}</p>
                  </div>
                )) : <p>{copy.noEmailPayloads}</p>}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
