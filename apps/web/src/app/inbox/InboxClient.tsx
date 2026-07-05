"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { notificationsInboxCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type Membership = {
  organization: {
    id: string;
    name: string;
  };
};

type CurrentUser = {
  memberships: Membership[];
};

type InboxMessage = {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
};

type InboxConversation = {
  id: string;
  customerName?: string | null;
  customerEmail?: string | null;
  channel: string;
  status: string;
  escalationReason?: string | null;
  internalNote?: string | null;
  updatedAt: string;
  messages: InboxMessage[];
  lead?: {
    id: string;
    score: number;
    status: string;
    summary: string;
  } | null;
};

type ConversationDetail = InboxConversation & {
  messages: InboxMessage[];
};

type InboxCopy = typeof notificationsInboxCopy["ro"]["inbox"];

function errorMessage(caughtError: unknown, fallback: string) {
  return caughtError instanceof Error ? caughtError.message : fallback;
}

function formatDate(value: string, locale: string, copy: InboxCopy) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return copy.dateUnavailable;
  }

  return parsedDate.toLocaleString(locale);
}

function statusLabel(status: string, copy: InboxCopy) {
  switch (status) {
    case "OPEN":
      return copy.open;
    case "WAITING_FOR_HUMAN":
      return copy.waitingForHuman;
    case "CLOSED":
      return copy.closed;
    default:
      return status;
  }
}

function senderLabel(sender: string, copy: InboxCopy) {
  switch (sender) {
    case "CUSTOMER":
      return copy.senderCustomer;
    case "AI":
      return copy.senderAi;
    case "HUMAN":
      return copy.senderHuman;
    case "SYSTEM":
      return copy.senderSystem;
    default:
      return sender;
  }
}

export function InboxClient() {
  const language = useAppLanguage();
  const copy = notificationsInboxCopy[language].inbox;
  const commonCopy = notificationsInboxCopy[language].common;
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [conversations, setConversations] = useState<InboxConversation[]>([]);
  const [selected, setSelected] = useState<ConversationDetail | null>(null);
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organizationId = user?.memberships[0]?.organization.id;

  function token() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function apiFetch(path: string, init: RequestInit = {}) {
    const accessToken = token();

    if (!accessToken) throw new Error(copy.loginRequired);

    return fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  }

  async function loadConversations(nextStatus = status, nextSource = source) {
    if (!organizationId) return;

    const params = new URLSearchParams();
    if (nextStatus) params.set("status", nextStatus);
    if (nextSource) params.set("source", nextSource);

    const response = await apiFetch(`/inbox/organization/${organizationId}/conversations?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? copy.loadInboxError);

    setConversations(data);
    if (!selected && data[0]) await loadConversation(data[0].id);
  }

  async function loadConversation(conversationId: string) {
    if (!organizationId) return;

    const response = await apiFetch(`/inbox/organization/${organizationId}/conversations/${conversationId}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? copy.loadConversationError);

    setSelected(data);
  }

  async function updateConversation(nextStatus: string) {
    if (!selected) return;

    const response = await apiFetch(`/reception-ai/conversations/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId, status: nextStatus }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? copy.updateConversationError);

    setSelected(data);
    await loadConversations();
  }

  async function sendHumanReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    const formData = new FormData(event.currentTarget);
    const content = String(formData.get("content") ?? "").trim();
    if (!content) return;

    const response = await apiFetch(`/reception-ai/conversations/${selected.id}/human-reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId, content }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? copy.sendReplyError);

    event.currentTarget.reset();
    setSelected(data);
    await loadConversations();
  }

  useEffect(() => {
    const accessToken = token();

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
        if (!response.ok) throw new Error(data.message ?? copy.loadSessionError);
        setUser(data);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : copy.loadSessionError))
      .finally(() => setIsLoading(false));
  }, [copy.loadSessionError, copy.loginRequired]);

  useEffect(() => {
    if (!organizationId) return;
    loadConversations().catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : copy.loadInboxError));
  }, [organizationId]);

  if (isLoading) return <p>{copy.loading}</p>;

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
    <div className="inbox-layout">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="inbox-grid">
        <aside className="card inbox-list">
          <div className="inbox-filters">
            <select value={status} onChange={(event) => { setStatus(event.target.value); loadConversations(event.target.value, source).catch((caughtError) => setError(errorMessage(caughtError, copy.loadInboxError))); }}>
              <option value="">{copy.allStatuses}</option>
              <option value="OPEN">{copy.open}</option>
              <option value="WAITING_FOR_HUMAN">{copy.waitingForHuman}</option>
              <option value="CLOSED">{copy.closed}</option>
            </select>
            <select value={source} onChange={(event) => { setSource(event.target.value); loadConversations(status, event.target.value).catch((caughtError) => setError(errorMessage(caughtError, copy.loadInboxError))); }}>
              <option value="">{copy.allSources}</option>
              <option value="public-web">{copy.websiteWidget}</option>
              <option value="web">{copy.internalWeb}</option>
            </select>
          </div>

          <div className="source-list">
            {conversations.length ? conversations.map((conversation) => {
              const preview = conversation.messages[0]?.content ?? copy.noMessages;
              return (
                <button className="source-item ghost-button" key={conversation.id} onClick={() => loadConversation(conversation.id).catch((caughtError) => setError(errorMessage(caughtError, copy.loadConversationError)))}>
                  <strong>{conversation.customerName || conversation.customerEmail || copy.anonymousVisitor}</strong>
                  <span>{statusLabel(conversation.status, copy)} · {conversation.channel} · {formatDate(conversation.updatedAt, locale, copy)}</span>
                  <p>{preview.slice(0, 140)}</p>
                </button>
              );
            }) : <p>{copy.noConversations}</p>}
          </div>
        </aside>

        <article className="card inbox-detail">
          {selected ? (
            <>
              <div className="inbox-header">
                <div>
                  <h2>{selected.customerName || selected.customerEmail || copy.anonymousVisitor}</h2>
                  <p>{statusLabel(selected.status, copy)} · {selected.channel}</p>
                  {selected.escalationReason ? <p>{copy.escalation}: {selected.escalationReason}</p> : null}
                  {selected.lead ? <p>{copy.lead}: {selected.lead.status} · {copy.score} {selected.lead.score}</p> : null}
                </div>
                <div className="mini-actions">
                  <button className="button mini" type="button" onClick={() => updateConversation("OPEN").catch((caughtError) => setError(errorMessage(caughtError, copy.updateConversationError)))}>{copy.open}</button>
                  <button className="button mini secondary" type="button" onClick={() => updateConversation("WAITING_FOR_HUMAN").catch((caughtError) => setError(errorMessage(caughtError, copy.updateConversationError)))}>{copy.humanTransfer}</button>
                  <button className="button mini secondary" type="button" onClick={() => updateConversation("CLOSED").catch((caughtError) => setError(errorMessage(caughtError, copy.updateConversationError)))}>{copy.close}</button>
                </div>
              </div>

              <div className="inbox-messages">
                {selected.messages.map((message) => (
                  <div className={`widget-message ${message.sender === "CUSTOMER" ? "customer" : "ai"}`} key={message.id}>
                    <strong>{senderLabel(message.sender, copy)}</strong>
                    <p>{message.content}</p>
                    <span>{formatDate(message.createdAt, locale, copy)}</span>
                  </div>
                ))}
              </div>

              <form className="widget-input" onSubmit={sendHumanReply}>
                <input name="content" placeholder={copy.replyPlaceholder} />
                <button className="button mini" type="submit">{copy.send}</button>
              </form>
            </>
          ) : <p>{copy.selectConversation}</p>}
        </article>
      </section>
    </div>
  );
}
