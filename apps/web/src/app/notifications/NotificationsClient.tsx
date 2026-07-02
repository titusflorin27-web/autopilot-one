"use client";

import { useEffect, useState } from "react";

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

export function NotificationsClient() {
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
    if (!accessToken) throw new Error("Autentifică-te înainte să vezi notificările.");

    const response = await fetch(`${API_URL}/notifications/organization/${organizationId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const json = await response.json();

    if (!response.ok) throw new Error(json.message ?? "Nu am putut încărca notificările");
    setData(json);
  }

  useEffect(() => {
    const accessToken = token();

    if (!accessToken) {
      setError("Autentifică-te înainte să vezi notificările.");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.message ?? "Nu am putut încărca sesiunea");
        setUser(json);
        const primary = json.memberships?.[0]?.organization;
        if (primary) await loadNotifications(primary.id);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Nu am putut încărca notificările"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Se încarcă notificările...</p>;

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
        <div className="eyebrow">Notificări</div>
        <h1>Centru de notificări.</h1>
        <p>{organization ? `Spațiu de lucru: ${organization.name}` : "Nu a fost găsită nicio organizație."}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {data ? (
        <>
          <section className="grid">
            <article className="card"><h3>Total</h3><div className="metric">{data.total}</div></article>
            <article className="card"><h3>Prioritate mare</h3><div className="metric">{data.highPriority}</div></article>
            <article className="card"><h3>Pregătite pentru email</h3><div className="metric">{data.emailReady.length}</div></article>
          </section>

          <section className="grid two-columns">
            <article className="card">
              <h2>Notificări active</h2>
              <div className="source-list">
                {data.items.length ? data.items.map((item) => (
                  <a className="source-item" href={item.href} key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.type} · {item.priority} · {new Date(item.createdAt).toLocaleString()}</span>
                    <p>{item.description}</p>
                  </a>
                )) : <p>Nu există notificări active.</p>}
              </div>
            </article>

            <article className="card">
              <h2>Mesaje pregătite pentru email</h2>
              <div className="source-list">
                {data.emailReady.length ? data.emailReady.map((item, index) => (
                  <div className="source-item" key={`${item.subject}-${index}`}>
                    <strong>{item.subject}</strong>
                    <span>{item.href}</span>
                    <p>{item.preview}</p>
                  </div>
                )) : <p>Nu există mesaje email pregătite.</p>}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
