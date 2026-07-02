"use client";

import { FormEvent, useEffect, useState } from "react";

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

type KnowledgeSource = {
  id: string;
  title: string;
  type: "TXT" | "PDF" | "DOCX" | "WEBSITE";
  status: "UPLOADED" | "INDEXED" | "FAILED";
  url?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  _count?: { chunks: number };
  createdAt: string;
};

type CautăResult = {
  chunkId: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: string;
  content: string;
  score: number;
};

export function KnowledgeBaseClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [sources, setSurse] = useState<KnowledgeSource[]>([]);
  const [results, setResults] = useState<CautăResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];

  function getAccessToken() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function apiFetch(path: string, init: RequestInit = {}) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("Please log in before using Knowledge Base.");
    }

    return fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  }

  async function loadSurse(organizationId: string) {
    const response = await apiFetch(`/knowledge-base/organization/${organizationId}/sources`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Could not load knowledge sources");
    }

    setSurse(data);
  }

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("Please log in before using Knowledge Base.");
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
          await loadSurse(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Could not load Knowledge Base");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onTextSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setError(null);

    if (!primaryMembership) {
      setError("No organization found for this account.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData(form);

    try {
      const response = await apiFetch("/knowledge-base/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: primaryMembership.organization.id,
          title: formData.get("title"),
          content: formData.get("content"),
          fileName: formData.get("title"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Could not index text source");
      }

      form.reset();
      await loadSurse(primaryMembership.organization.id);
      setMessage("TXT source indexed.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not index text source");
    } finally {
      setIsSaving(false);
    }
  }

  async function onWebsiteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setError(null);

    if (!primaryMembership) {
      setError("No organization found for this account.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData(form);

    try {
      const response = await apiFetch("/knowledge-base/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: primaryMembership.organization.id,
          title: formData.get("title") || undefined,
          url: formData.get("url"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Could not index website");
      }

      form.reset();
      await loadSurse(primaryMembership.organization.id);
      setMessage("Website indexed.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not index website");
    } finally {
      setIsSaving(false);
    }
  }

  async function onFileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setError(null);

    if (!primaryMembership) {
      setError("No organization found for this account.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData(form);
    formData.set("organizationId", primaryMembership.organization.id);

    try {
      const response = await apiFetch("/knowledge-base/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Could not upload file");
      }

      form.reset();
      await loadSurse(primaryMembership.organization.id);
      setMessage("File uploaded and indexed.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not upload file");
    } finally {
      setIsSaving(false);
    }
  }

  async function onCautăSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!primaryMembership) {
      setError("No organization found for this account.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiFetch("/knowledge-base/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: primaryMembership.organization.id,
          query: formData.get("query"),
          limit: 8,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Caută failed");
      }

      setResults(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Caută failed");
    }
  }

  if (isLoading) {
    return <p>Loading Knowledge Base...</p>;
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
    <div className="knowledge-layout">
      <section className="card">
        <div className="eyebrow">Bază de cunoștințe</div>
        <h1>Învață Autopilot One informațiile importante despre compania ta.</h1>
        <p>{primaryMembership ? `Workspace: ${primaryMembership.organization.name}` : "Nu a fost găsită nicio organizație."}</p>
      </section>

      <section className="grid two-columns">
        <form className="card form-section" onSubmit={onTextSubmit}>
          <h3>TXT source</h3>
          <input name="title" placeholder="Titlu sursă" required />
          <textarea name="content" placeholder="Lipește informații despre companie, politici, produse, servicii sau întrebări frecvente." required />
          <button className="button" disabled={isSaving} type="submit">Indexează textul</button>
        </form>

        <form className="card form-section" onSubmit={onWebsiteSubmit}>
          <h3>Website source</h3>
          <input name="url" placeholder="https://example.com" type="url" required />
          <input name="title" placeholder="Titlu opțional" />
          <button className="button" disabled={isSaving} type="submit">Indexează website-ul</button>
        </form>
      </section>

      <section className="grid two-columns">
        <form className="card form-section" onSubmit={onFileSubmit}>
          <h3>Upload PDF / DOCX / TXT</h3>
          <input name="title" placeholder="Titlu opțional" />
          <input name="file" type="file" accept=".pdf,.docx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required />
          <button className="button" disabled={isSaving} type="submit">Încarcă și indexează</button>
        </form>

        <form className="card form-section" onSubmit={onCautăSubmit}>
          <h3>Semantic search</h3>
          <input name="query" placeholder="Caută în baza de cunoștințe" required />
          <button className="button" type="submit">Caută</button>
        </form>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="grid two-columns">
        <article className="card">
          <h2>Surse</h2>
          <div className="source-list">
            {sources.length ? sources.map((source) => (
              <div className="source-item" key={source.id}>
                <strong>{source.title}</strong>
                <span>{source.type} · {source.status} · {source._count?.chunks ?? 0} chunks</span>
              </div>
            )) : <p>No sources indexed yet.</p>}
          </div>
        </article>

        <article className="card">
          <h2>Caută results</h2>
          <div className="source-list">
            {results.length ? results.map((result) => (
              <div className="source-item" key={result.chunkId}>
                <strong>{result.sourceTitle} · {result.sourceType}</strong>
                <span>Score {result.score.toFixed(2)}</span>
                <p>{result.content}</p>
              </div>
            )) : <p>Run a search to retrieve indexed knowledge.</p>}
          </div>
        </article>
      </section>
    </div>
  );
}
