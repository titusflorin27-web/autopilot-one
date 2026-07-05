"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type DemoRequestStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";
type DemoRequestStatusFilter = "ALL" | DemoRequestStatus;

function errorMessage(caughtError: unknown, fallback: string) {
  return caughtError instanceof Error ? caughtError.message : fallback;
}

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
  internalNote?: string | null;
  nextStep?: string | null;
  followUpAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

const statusLabels: Record<DemoRequestStatus, string> = {
  NEW: "Nou",
  CONTACTED: "Contactat",
  QUALIFIED: "Calificat",
  CLOSED: "Închis",
};

const statusFilters: Array<{ value: DemoRequestStatusFilter; label: string }> = [
  { value: "ALL", label: "Toate" },
  { value: "NEW", label: "Nou" },
  { value: "CONTACTED", label: "Contactat" },
  { value: "QUALIFIED", label: "Calificat" },
  { value: "CLOSED", label: "Închis" },
];

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

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
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
  const [statusFilter, setStatusFilter] = useState<DemoRequestStatusFilter>("ALL");
  const [internalNote, setInternalNote] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSavingCrm, setIsSavingCrm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredRequests = useMemo(
    () => statusFilter === "ALL" ? requests : requests.filter((request) => request.status === statusFilter),
    [requests, statusFilter],
  );

  const selected = useMemo(
    () => (selectedId ? filteredRequests.find((request) => request.id === selectedId) : null) ?? filteredRequests[0] ?? null,
    [filteredRequests, selectedId],
  );

  useEffect(() => {
    if (!selected) {
      setInternalNote("");
      setNextStep("");
      setFollowUpAt("");
      return;
    }

    setInternalNote(selected.internalNote ?? "");
    setNextStep(selected.nextStep ?? "");
    setFollowUpAt(toDateTimeLocal(selected.followUpAt));
  }, [selected?.id, selected?.internalNote, selected?.nextStep, selected?.followUpAt]);

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

  function replaceRequest(updatedRequest: DemoRequest) {
    setRequests((currentRequests) => currentRequests.map((request) => request.id === updatedRequest.id ? updatedRequest : request));
    setSelectedId(updatedRequest.id);
  }

  async function loadDemoRequests() {
    const response = await apiFetch("/demo-requests");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Nu am putut încărca cererile demo.");
    }

    setRequests(data);
    setSelectedId((currentSelectedId) => data.some((request: DemoRequest) => request.id === currentSelectedId) ? currentSelectedId : data[0]?.id ?? null);
  }

  async function updateStatus(status: DemoRequestStatus) {
    if (!selected) return;

    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

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

      replaceRequest(updatedRequest);
      setSuccessMessage("Statusul a fost actualizat.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Nu am putut actualiza statusul cererii demo.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function saveCrmFields() {
    if (!selected) return;

    setIsSavingCrm(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiFetch(`/demo-requests/${selected.id}/crm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalNote: internalNote || null,
          nextStep: nextStep || null,
          followUpAt: followUpAt ? new Date(followUpAt).toISOString() : null,
        }),
      });
      const updatedRequest = await response.json();

      if (!response.ok) {
        throw new Error(updatedRequest.message ?? "Nu am putut salva detaliile CRM.");
      }

      replaceRequest(updatedRequest);
      setSuccessMessage("Detaliile CRM au fost salvate.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Nu am putut salva detaliile CRM.");
    } finally {
      setIsSavingCrm(false);
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
        <p>Vezi cine a cerut o discuție, filtrează după status și notează următorul pas. Cererile sunt păstrate în DB și nu pot fi șterse din această interfață.</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {successMessage ? <p className="form-success">{successMessage}</p> : null}

      <section className="inbox-grid">
        <aside className="card inbox-list">
          <div className="inbox-header compact-header">
            <div>
              <h2>{filteredRequests.length}</h2>
              <p>{statusFilter === "ALL" ? `${requests.length} cereri demo` : `${statusLabels[statusFilter]} · ${requests.length} total`}</p>
            </div>
            <button className="button mini secondary" type="button" onClick={() => loadDemoRequests().catch((caughtError) => setError(errorMessage(caughtError, "Nu am putut încărca cererile demo.")))}>
              Reîncarcă
            </button>
          </div>

          <label className="field-label">Filtru status</label>
          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as DemoRequestStatusFilter); setSelectedId(null); }}>
            {statusFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
          </select>

          <div className="source-list">
            {filteredRequests.length ? filteredRequests.map((request) => (
              <button className="source-item ghost-button" key={request.id} type="button" onClick={() => setSelectedId(request.id)}>
                <strong>{request.name}</strong>
                <span>{request.email}</span>
                <span>{request.company || "Fără companie"} · {statusLabels[request.status]}</span>
                {request.nextStep ? <span>Următorul pas: {request.nextStep}</span> : null}
                {request.followUpAt ? <span>Follow-up: {formatDate(request.followUpAt)}</span> : null}
                <p>{request.message.slice(0, 140)}</p>
              </button>
            )) : <p>Nu există cereri demo pentru filtrul selectat.</p>}
          </div>
        </aside>

        <article className="card inbox-detail">
          {selected ? (
            <>
              <div className="inbox-header compact-header">
                <div>
                  <span className="status-pill">{statusLabels[selected.status]}</span>
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
                  <strong>CRM Lite</strong>
                  <label className="field-label">Notă internă</label>
                  <textarea value={internalNote} maxLength={2000} onChange={(event) => setInternalNote(event.target.value)} placeholder="Ex: client interesat de widget pentru clinici, vrea demo săptămâna viitoare." />

                  <label className="field-label">Următorul pas</label>
                  <input value={nextStep} maxLength={500} onChange={(event) => setNextStep(event.target.value)} placeholder="Ex: sună clientul / trimite ofertă / pregătește demo" />

                  <label className="field-label">Dată follow-up</label>
                  <input type="datetime-local" value={followUpAt} onChange={(event) => setFollowUpAt(event.target.value)} />

                  <button className="button mini" type="button" disabled={isSavingCrm} onClick={saveCrmFields}>
                    {isSavingCrm ? "Se salvează..." : "Salvează detaliile CRM"}
                  </button>
                </article>

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
