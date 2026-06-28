"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type DemoRequestStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";

type DemoRequest = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  website?: string | null;
  message: string;
  source: string;
  status: DemoRequestStatus;
  createdAt: string;
  updatedAt: string;
};

const statusActions: Array<{ status: DemoRequestStatus; label: string }> = [
  { status: "CONTACTED", label: "Marchează contactat" },
  { status: "QUALIFIED", label: "Califică" },
  { status: "CLOSED", label: "Închide" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function safeWebsiteUrl(value?: string | null) {
  if (!value) return null;

  try {
    const candidate = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function DemoRequestsClient() {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? requests[0] ?? null,
    [requests, selectedId],
  );

  function getAccessToken() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function apiFetch(path: string, init: RequestInit = {}) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("Autentifică-te pentru a vedea cererile demo.");
    }

    return fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  }

  async function loadDemoRequests() {
    const response = await apiFetch("/demo-requests");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Nu am putut încărca cererile demo.");
    }

    setRequests(data);
    setSelectedId((currentSelectedId) => currentSelectedId ?? data[0]?.id ?? null);
  }

  async function updateStatus(status: DemoRequestStatus) {
    if (!selected) return;

    setIsUpdating(true);
    setError(null);

    try {
      const response = await apiFetch(`/demo-requests/${selected.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updatedRequest = await response.json();

      if (!response.ok) {
        throw new Error(updatedRequest.message ?? "Nu am putut actualiza statusul cererii demo.");
      }

      setRequests((currentRequests) => currentRequests.map((request) => request.id === updatedRequest.id ? updatedRequest : request));
      setSelectedId(updatedRequest.id);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Nu am putut actualiza statusul cererii demo.");
    } finally {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    loadDemoRequests()
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Nu am putut încărca cererile demo."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>Se încarcă cererile demo...</p>;
  }

  if (error && !requests.length) {
    return (
      <section className="card">
        <h1>Autentificare necesară.</h1>
        <p>{error}</p>
        <a href="/login" className="button">Mergi la login</a>
      </section>
    );
  }

  const selectedWebsite = safeWebsiteUrl(selected?.website);

  return (
    <div className="inbox-layout">
      <section className="card">
        <div className="eyebrow">Cereri demo</div>
        <h1>Lead-uri venite din formularul public.</h1>
        <p>Vezi rapid cine a cerut o discuție despre Autopilot One. Cererile sunt păstrate în DB și nu pot fi șterse din această interfață.</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="inbox-grid">
        <aside className="card inbox-list">
          <div className="inbox-header compact-header">
            <div>
              <h2>{requests.length}</h2>
              <p>Cereri demo</p>
            </div>
            <button className="button mini secondary" type="button" onClick={() => loadDemoRequests().catch((caughtError) => setError(String(caughtError)))}>
              Reîncarcă
            </button>
          </div>

          <div className="source-list">
            {requests.length ? requests.map((request) => (
              <button className="source-item ghost-button" key={request.id} type="button" onClick={() => setSelectedId(request.id)}>
                <strong>{request.name}</strong>
                <span>{request.email}</span>
                <span>{request.company || "Fără companie"} · {request.status}</span>
                <p>{request.message.slice(0, 140)}</p>
              </button>
            )) : <p>Nu există cereri demo încă.</p>}
          </div>
        </aside>

        <article className="card inbox-detail">
          {selected ? (
            <>
              <div className="inbox-header compact-header">
                <div>
                  <span className="status-pill">{selected.status}</span>
                  <h2>{selected.name}</h2>
                  <p>{formatDate(selected.createdAt)}</p>
                </div>
                <div className="mini-actions compact-actions">
                  <a className="button mini" href={`mailto:${selected.email}`}>Email</a>
                  {selected.phone ? <a className="button mini secondary" href={`tel:${selected.phone}`}>Telefon</a> : null}
                  {selectedWebsite ? <a className="button mini secondary" href={selectedWebsite} target="_blank" rel="noreferrer">Website</a> : null}
                </div>
              </div>

              <div className="mini-actions status-actions">
                {statusActions.map((action) => (
                  <button
                    className={`button mini ${action.status === selected.status ? "" : "secondary"}`}
                    disabled={isUpdating || action.status === selected.status}
                    key={action.status}
                    type="button"
                    onClick={() => updateStatus(action.status)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="source-list">
                <article className="source-item">
                  <strong>Email</strong>
                  <span>{selected.email}</span>
                </article>
                <article className="source-item">
                  <strong>Companie</strong>
                  <span>{selected.company || "Nespecificat"}</span>
                </article>
                <article className="source-item">
                  <strong>Telefon</strong>
                  <span>{selected.phone || "Nespecificat"}</span>
                </article>
                <article className="source-item">
                  <strong>Website</strong>
                  <span>{selected.website || "Nespecificat"}</span>
                </article>
                <article className="source-item">
                  <strong>Sursă</strong>
                  <span>{selected.source}</span>
                </article>
                <article className="source-item">
                  <strong>Mesaj</strong>
                  <p>{selected.message}</p>
                </article>
              </div>
            </>
          ) : <p>Selectează o cerere demo.</p>}
        </article>
      </section>
    </div>
  );
}
