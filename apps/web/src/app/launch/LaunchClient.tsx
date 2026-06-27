"use client";

import { useEffect, useState } from "react";

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
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checklist, setChecklist] = useState<LaunchChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function token() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function loadChecklist(organizationId: string) {
    const accessToken = token();
    if (!accessToken) throw new Error("Please log in before viewing launch checklist.");
    const response = await fetch(`${API_URL}/launch/organization/${organizationId}/checklist`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message ?? "Could not load launch checklist");
    setChecklist(json);
  }

  useEffect(() => {
    const accessToken = token();
    if (!accessToken) {
      setError("Please log in before viewing launch checklist.");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.message ?? "Could not load session");
        setUser(json);
        const primary = json.memberships?.[0]?.organization;
        if (primary) await loadChecklist(primary.id);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Could not load launch checklist"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading launch checklist...</p>;

  if (error && !user) {
    return (
      <section className="card">
        <h1>Authentication required.</h1>
        <p>{error}</p>
        <a href="/login" className="button">Go to login</a>
      </section>
    );
  }

  return (
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">BUILD #019 Demo Flow</div>
        <h1>MVP launch checklist.</h1>
        <p>{checklist ? `${checklist.organization.name}: ${checklist.completed}/${checklist.total} steps complete.` : "No checklist loaded."}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {checklist ? (
        <>
          <section className="grid">
            <article className="card">
              <h3>Progress</h3>
              <div className="metric">{checklist.progress}%</div>
            </article>
            <article className="card">
              <h3>Ready for pilot</h3>
              <div className="metric">{checklist.readyForPilot ? "Yes" : "Not yet"}</div>
            </article>
            <article className="card">
              <h3>Public conversations</h3>
              <div className="metric">{checklist.metrics.publicConversations}</div>
            </article>
          </section>

          <section className="grid two-columns">
            <article className="card">
              <h2>Guided demo path</h2>
              <div className="source-list">
                {checklist.steps.map((step, index) => (
                  <a className="source-item" href={step.href} key={step.id}>
                    <strong>{step.complete ? "✓" : "○"} {index + 1}. {step.title}</strong>
                    <span>{step.complete ? "Complete" : "Needs action"}</span>
                    <p>{step.description}</p>
                  </a>
                ))}
              </div>
            </article>

            <article className="card">
              <h2>Demo script</h2>
              <div className="source-list">
                <div className="source-item"><strong>1. Register and open dashboard</strong><p>Show identity, workspace and protected app shell.</p></div>
                <div className="source-item"><strong>2. Complete Business DNA</strong><p>Show how the company context becomes AI operating context.</p></div>
                <div className="source-item"><strong>3. Add Knowledge Base</strong><p>Upload or paste content that Reception AI can cite.</p></div>
                <div className="source-item"><strong>4. Install widget</strong><p>Copy the snippet and explain token/origin controls.</p></div>
                <div className="source-item"><strong>5. Send website message</strong><p>Create a public conversation and lead.</p></div>
                <div className="source-item"><strong>6. Resolve in Inbox</strong><p>Open handoff, reply as human, close the loop.</p></div>
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
