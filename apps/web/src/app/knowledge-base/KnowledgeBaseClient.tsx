"use client";

import { FormEvent, useEffect, useState } from "react";
import { knowledgeBaseCopy } from "../../lib/i18n";
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

type SearchResult = {
  chunkId: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: string;
  content: string;
  score: number;
};

type KnowledgeCopy = typeof knowledgeBaseCopy["ro"];

function formatDate(value: string, locale: string, copy: KnowledgeCopy) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return copy.dateUnavailable;
  }

  return parsedDate.toLocaleString(locale);
}

export function KnowledgeBaseClient() {
  const language = useAppLanguage();
  const copy = knowledgeBaseCopy[language];
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
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

  async function loadSources(organizationId: string) {
    const response = await apiFetch(`/knowledge-base/organization/${organizationId}/sources`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? copy.loadSourcesError);
    }

    setSources(data);
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
          await loadSources(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : copy.loadKnowledgeBaseError);
      })
      .finally(() => setIsLoading(false));
  }, [copy.loadKnowledgeBaseError, copy.loadSessionError, copy.loginRequired]);

  async function onTextSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setError(null);

    if (!primaryMembership) {
      setError(copy.organizationMissing);
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
        throw new Error(data.message ?? copy.indexTextError);
      }

      form.reset();
      await loadSources(primaryMembership.organization.id);
      setMessage(copy.textIndexed);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.indexTextError);
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
      setError(copy.organizationMissing);
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
        throw new Error(data.message ?? copy.indexWebsiteError);
      }

      form.reset();
      await loadSources(primaryMembership.organization.id);
      setMessage(copy.websiteIndexed);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.indexWebsiteError);
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
      setError(copy.organizationMissing);
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
        throw new Error(data.message ?? copy.uploadFileError);
      }

      form.reset();
      await loadSources(primaryMembership.organization.id);
      setMessage(copy.fileIndexed);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.uploadFileError);
    } finally {
      setIsSaving(false);
    }
  }

  async function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!primaryMembership) {
      setError(copy.organizationMissing);
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
        throw new Error(data.message ?? copy.searchError);
      }

      setResults(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.searchError);
    }
  }

  if (isLoading) {
    return (
      <section className="card protected-loading-card">
        <div className="eyebrow">Se încarcă</div>
        <h1>Bază de cunoștințe</h1>
        <p>{copy.loading}</p>
        <p className="helper-text">Pregătim sursele, fișierele și căutarea pentru AI.</p>
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
        <p>{copy.description}</p>
        <p>{primaryMembership ? `${copy.workspacePrefix}: ${primaryMembership.organization.name}` : copy.organizationMissing}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="grid two-columns">
        <article className="card">
          <h2>{copy.textSourceTitle}</h2>
          <form className="form-stack" onSubmit={onTextSubmit}>
            <label>
              {copy.titleLabel}
              <input name="title" placeholder={copy.sourceTitlePlaceholder} required />
            </label>
            <label>
              {copy.contentLabel}
              <textarea name="content" placeholder={copy.contentPlaceholder} required />
            </label>
            <button className="button" type="submit" disabled={isSaving || !primaryMembership}>
              {isSaving ? copy.saving : copy.addTextButton}
            </button>
          </form>
        </article>

        <article className="card">
          <h2>{copy.websiteSourceTitle}</h2>
          <form className="form-stack" onSubmit={onWebsiteSubmit}>
            <label>
              {copy.titleLabel}
              <input name="title" placeholder={copy.websiteTitlePlaceholder} />
            </label>
            <label>
              {copy.urlLabel}
              <input name="url" type="url" placeholder={copy.urlPlaceholder} required />
            </label>
            <button className="button" type="submit" disabled={isSaving || !primaryMembership}>
              {isSaving ? copy.saving : copy.addWebsiteButton}
            </button>
          </form>
        </article>
      </section>

      <section className="grid two-columns">
        <article className="card">
          <h2>{copy.fileSourceTitle}</h2>
          <form className="form-stack" onSubmit={onFileSubmit}>
            <label>
              {copy.titleLabel}
              <input name="title" placeholder={copy.fileTitlePlaceholder} />
            </label>
            <label>
              {copy.fileLabel}
              <input name="file" type="file" accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required />
            </label>
            <button className="button" type="submit" disabled={isSaving || !primaryMembership}>
              {isSaving ? copy.saving : copy.uploadButton}
            </button>
          </form>
        </article>

        <article className="card">
          <h2>{copy.searchTitle}</h2>
          <form className="form-stack" onSubmit={onSearchSubmit}>
            <input name="query" placeholder={copy.searchPlaceholder} required />
            <button className="button" type="submit" disabled={!primaryMembership}>{copy.searchButton}</button>
          </form>

          <div className="source-list">
            {results.length ? results.map((result) => (
              <div className="source-item" key={result.chunkId}>
                <strong>{result.sourceTitle}</strong>
                <span>{result.sourceType} · {copy.score} {result.score.toFixed(3)}</span>
                <p>{result.content}</p>
              </div>
            )) : <p>{copy.noResults}</p>}
          </div>
        </article>
      </section>

      <section className="card">
        <h2>{copy.sourcesTitle}</h2>
        <div className="source-list">
          {sources.length ? sources.map((source) => (
            <div className="source-item" key={source.id}>
              <strong>{source.title}</strong>
              <span>{source.type} · {copy.status}: {source.status} · {(source._count?.chunks ?? 0).toLocaleString(locale)} {copy.chunks}</span>
              <p>{source.url ?? source.fileName ?? source.mimeType ?? `${copy.created}: ${formatDate(source.createdAt, locale, copy)}`}</p>
            </div>
          )) : <p>{copy.noSources}</p>}
        </div>
      </section>
    </div>
  );
}
