"use client";

import { useEffect, useState } from "react";
import { billingLaunchCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type Membership = { organization: { id: string; name: string } };
type CurrentUser = { memberships: Membership[] };
type LaunchStep = { id: string; title: string; description: string; href: string; complete: boolean };
type LaunchChecklist = {
  organization: { id: string; name: string; slug: string };
  completed: number;
  total: number;
  progress: number;
  readyForPilot: boolean;
  metrics: Record<string, number>;
  steps: LaunchStep[];
};

export function LaunchClient() {
  const language = useAppLanguage();
  const copy = billingLaunchCopy[language].launch;
  const commonCopy = billingLaunchCopy[language].common;
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checklist, setChecklist] = useState<LaunchChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function token() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function loadChecklist(organizationId: string) {
    const accessToken = token();
    if (!accessToken) throw new Error(copy.loginRequired);
    const response = await fetch(`${API_URL}/launch/organization/${organizationId}/checklist`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message ?? copy.loadChecklistError);
    setChecklist(json);
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
        if (primary) await loadChecklist(primary.id);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : copy.loadChecklistError))
      .finally(() => setIsLoading(false));
  }, [copy.loadChecklistError, copy.loadSessionError, copy.loginRequired]);

  if (isLoading) {
    return (
      <section className="card protected-loading-card">
        <div className="eyebrow">Se încarcă</div>
        <h1>Checklist lansare</h1>
        <p>{copy.loading}</p>
        <p className="helper-text">Pregătim pașii operaționali pentru configurarea workspace-ului.</p>
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
        <p>{checklist ? `${checklist.organization.name}: ${checklist.completed}/${checklist.total} ${copy.stepsComplete}.` : copy.noChecklist}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {checklist ? (
        <>
          <section className="grid">
            <article className="card">
              <h3>{copy.progress}</h3>
              <div className="metric">{checklist.progress}%</div>
            </article>
            <article className="card">
              <h3>{copy.readyForPilot}</h3>
              <div className="metric">{checklist.readyForPilot ? copy.yes : copy.notYet}</div>
            </article>
            <article className="card">
              <h3>{copy.publicConversations}</h3>
              <div className="metric">{checklist.metrics.publicConversations.toLocaleString(locale)}</div>
            </article>
          </section>

          <section className="grid two-columns">
            <article className="card">
              <h2>{copy.guidedFlowTitle}</h2>
              <div className="source-list">
                {checklist.steps.map((step, index) => (
                  <a className="source-item" href={step.href} key={step.id}>
                    <strong>{step.complete ? "✓" : "○"} {index + 1}. {step.title}</strong>
                    <span>{step.complete ? copy.complete : copy.needsAction}</span>
                    <p>{step.description}</p>
                  </a>
                ))}
              </div>
            </article>

            <article className="card">
              <h2>{copy.scriptTitle}</h2>
              <div className="source-list">
                {copy.script.map((item, index) => (
                  <div className="source-item" key={item.title}>
                    <strong>{index + 1}. {item.title}</strong>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
