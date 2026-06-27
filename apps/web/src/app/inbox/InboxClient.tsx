"use client";

import { FormEvent, useEffect, useState } from "react";

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

export function InboxClient() {
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

    if (!accessToken) throw new Error("Please log in before using Inbox.");

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

    if (!response.ok) throw new Error(data.message ?? "Could not load inbox");

    setConversations(data);
    if (!selected && data[0]) await loadConversation(data[0].id);
  }

  async function loadConversation(conversationId: string) {
    if (!organizationId) return;

    const response = await apiFetch(`/inbox/organization/${organizationId}/conversations/${conversationId}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? "Could not load conversation");

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

    if (!response.ok) throw new Error(data.message ?? "Could not update conversation");

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

    if (!response.ok) throw new Error(data.message ?? "Could not send reply");

    event.currentTarget.reset();
    setSelected(data);
    await loadConversations();
  }

  useEffect(() => {
    const accessToken = token();

    if (!accessToken) {
      setError("Please log in before using Inbox.");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Could not load session");
        setUser(data);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Could not load session"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!organizationId) return;
    loadConversations().catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Could not load inbox"));
  }, [organizationId]);

  if (isLoading) return <p>Loading inbox...</p>;

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
    <div className="inbox-layout">
      <section className="card">
        <div className="eyebrow">BUILD #015 Unified Inbox</div>
        <h1>Operator inbox.</h1>
        <p>Review website conversations, AI escalations, leads and human replies in one place.</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="inbox-grid">
        <aside className="card inbox-list">
          <div className="inbox-filters">
            <select value={status} onChange={(event) => { setStatus(event.target.value); loadConversations(event.target.value, source).catch(console.error); }}>
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="WAITING_FOR_HUMAN">Waiting for human</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select value={source} onChange={(event) => { setSource(event.target.value); loadConversations(status, event.target.value).catch(console.error); }}>
              <option value="">All sources</option>
              <option value="public-web">Website widget</option>
              <option value="web">Internal web</option>
            </select>
          </div>

          <div className="source-list">
            {conversations.length ? conversations.map((conversation) => {
              const preview = conversation.messages[0]?.content ?? "No messages yet.";
              return (
                <button className="source-item ghost-button" key={conversation.id} onClick={() => loadConversation(conversation.id).catch(console.error)}>
                  <strong>{conversation.customerName || conversation.customerEmail || "Anonymous visitor"}</strong>
                  <span>{conversation.status} · {conversation.channel}</span>
                  <p>{preview.slice(0, 140)}</p>
                </button>
              );
            }) : <p>No conversations found.</p>}
          </div>
        </aside>

        <article className="card inbox-detail">
          {selected ? (
            <>
              <div className="inbox-header">
                <div>
                  <h2>{selected.customerName || selected.customerEmail || "Anonymous visitor"}</h2>
                  <p>{selected.status} · {selected.channel}</p>
                  {selected.escalationReason ? <p>Escalation: {selected.escalationReason}</p> : null}
                  {selected.lead ? <p>Lead: {selected.lead.status} · score {selected.lead.score}</p> : null}
                </div>
                <div className="mini-actions">
                  <button className="button mini" type="button" onClick={() => updateConversation("OPEN").catch((caughtError) => setError(String(caughtError)))}>Open</button>
                  <button className="button mini secondary" type="button" onClick={() => updateConversation("WAITING_FOR_HUMAN").catch((caughtError) => setError(String(caughtError)))}>Handoff</button>
                  <button className="button mini secondary" type="button" onClick={() => updateConversation("CLOSED").catch((caughtError) => setError(String(caughtError)))}>Close</button>
                </div>
              </div>

              <div className="inbox-messages">
                {selected.messages.map((message) => (
                  <div className={`widget-message ${message.sender === "CUSTOMER" ? "customer" : "ai"}`} key={message.id}>
                    <strong>{message.sender}</strong>
                    <p>{message.content}</p>
                    <span>{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <form className="widget-input" onSubmit={sendHumanReply}>
                <input name="content" placeholder="Write a human reply..." />
                <button className="button mini" type="submit">Send</button>
              </form>
            </>
          ) : <p>Select a conversation.</p>}
        </article>
      </section>
    </div>
  );
}
