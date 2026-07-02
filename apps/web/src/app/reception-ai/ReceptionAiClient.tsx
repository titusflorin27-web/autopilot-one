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

type ReceptionResult = {
  conversationId: string;
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  escalationReason?: string | null;
  leadId?: string | null;
  taskId?: string | null;
  aiProvider?: string;
  aiModel?: string;
  usedFallback?: boolean;
  citations: Array<{
    sourceTitle: string;
    content: string;
    score: number;
  }>;
};

type Conversation = {
  id: string;
  customerName?: string | null;
  customerEmail?: string | null;
  status: string;
  escalationReason?: string | null;
  internalNote?: string | null;
  messages: Array<{ id: string; sender: string; content: string }>;
  lead?: { id: string; score: number; status: string } | null;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  ownerNote?: string | null;
};

type Lead = {
  id: string;
  name?: string | null;
  email?: string | null;
  summary: string;
  score: number;
  status: string;
  ownerNote?: string | null;
};

type OperationsSummary = {
  conversations: Record<string, number>;
  tasks: Record<string, number>;
  leads: Record<string, number>;
};

export function ReceptionAiClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [summary, setSummary] = useState<OperationsSummary | null>(null);
  const [conversations, setConversații] = useState<Conversation[]>([]);
  const [tasks, setSarcini] = useState<Task[]>([]);
  const [leads, setLeaduri] = useState<Lead[]>([]);
  const [result, setResult] = useState<ReceptionResult | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];

  function getAccessToken() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function apiFetch(path: string, init: RequestInit = {}) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("Autentifică-te înainte să folosești Recepționerul AI.");
    }

    return fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  }

  async function loadReceptionState(organizationId: string) {
    const [summaryResponse, conversationsResponse, tasksResponse, leadsResponse] = await Promise.all([
      apiFetch(`/reception-ai/organization/${organizationId}/summary`),
      apiFetch(`/reception-ai/organization/${organizationId}/conversations`),
      apiFetch(`/reception-ai/organization/${organizationId}/tasks`),
      apiFetch(`/reception-ai/organization/${organizationId}/leads`),
    ]);

    const summaryData = await summaryResponse.json();
    const conversationsData = await conversationsResponse.json();
    const tasksData = await tasksResponse.json();
    const leadsData = await leadsResponse.json();

    if (!summaryResponse.ok) {
      throw new Error(summaryData.message ?? "Could not load operations summary");
    }

    if (!conversationsResponse.ok) {
      throw new Error(conversationsData.message ?? "Could not load conversations");
    }

    if (!tasksResponse.ok) {
      throw new Error(tasksData.message ?? "Could not load tasks");
    }

    if (!leadsResponse.ok) {
      throw new Error(leadsData.message ?? "Could not load leads");
    }

    setSummary(summaryData);
    setConversații(conversationsData);
    setSarcini(tasksData);
    setLeaduri(leadsData);
  }

  async function refresh() {
    if (primaryMembership) {
      await loadReceptionState(primaryMembership.organization.id);
    }
  }

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("Autentifică-te înainte să folosești Recepționerul AI.");
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
          await loadReceptionState(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Nu am putut încărca Recepționerul AI");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!primaryMembership) {
      setError("Nu a fost găsită nicio organizație pentru acest cont.");
      return;
    }

    setIsSending(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiFetch("/reception-ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: primaryMembership.organization.id,
          conversationId: activeConversationId ?? undefined,
          customerName: formData.get("customerName") || undefined,
          customerEmail: formData.get("customerEmail") || undefined,
          channel: "web-demo",
          message: formData.get("message"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Recepționerul AI nu a putut răspunde");
      }

      setResult(data);
      setActiveConversationId(data.conversationId);
      await loadReceptionState(primaryMembership.organization.id);
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Recepționerul AI nu a putut răspunde");
    } finally {
      setIsSending(false);
    }
  }

  async function patchJson(path: string, body: Record<string, unknown>) {
    const response = await apiFetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Operation failed");
    }

    await refresh();
  }

  async function updateConversation(conversationId: string, status: string) {
    try {
      await patchJson(`/reception-ai/conversations/${conversationId}`, { status });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not update conversation");
    }
  }

  async function updateTask(taskId: string, status: string) {
    try {
      await patchJson(`/reception-ai/tasks/${taskId}`, { status });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not update task");
    }
  }

  async function updateLead(leadId: string, status: string) {
    try {
      await patchJson(`/reception-ai/leads/${leadId}`, { status });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not update lead");
    }
  }

  async function onHumanReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!activeConversationId) {
      setError("Select a conversation before adding a human reply.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiFetch(`/reception-ai/conversations/${activeConversationId}/human-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.get("content"),
          internalNote: formData.get("internalNote") || undefined,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Could not add human reply");
      }

      await refresh();
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not add human reply");
    }
  }

  if (isLoading) {
    return <p>Se încarcă Recepționerul AI...</p>;
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
    <div className="reception-layout">
      <section className="card">
        <div className="eyebrow">Recepționer AI</div>
        <h1>Recepționerul AI este conectat la gateway-ul de model.</h1>
        <p>{primaryMembership ? `Spațiu de lucru: ${primaryMembership.organization.name}` : "Nu a fost găsită nicio organizație."}</p>
      </section>

      <section className="grid">
        <article className="card">
          <h3>Waiting for human</h3>
          <div className="metric">{summary?.conversations?.WAITING_FOR_HUMAN ?? 0}</div>
        </article>
        <article className="card">
          <h3>Sarcini deschise</h3>
          <div className="metric">{summary?.tasks?.OPEN ?? 0}</div>
        </article>
        <article className="card">
          <h3>Last AI mode</h3>
          <div className="metric">{result?.usedFallback ? "Fallback" : result?.aiProvider ?? "Niciunul"}</div>
        </article>
      </section>

      <section className="grid two-columns">
        <form className="card form-section" onSubmit={onSubmit}>
          <h3>Simulate customer message</h3>
          <input name="customerName" placeholder="Nume client" />
          <input name="customerEmail" placeholder="Email client" type="email" />
          <textarea name="message" placeholder="Ex: vreau prețuri și un demo pentru compania mea săptămâna viitoare." required />
          <button className="button" type="submit" disabled={isSending}>
            {isSending ? "Recepționerul AI gândește..." : "Trimite către Recepționerul AI"}
          </button>
        </form>

        <article className="card">
          <h3>AI response</h3>
          {result ? (
            <div className="source-list">
              <div className="source-item">
                <strong>Reply</strong>
                <p>{result.reply}</p>
                <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                <span>Escalation: {result.shouldEscalate ? "yes" : "no"}</span>
                {result.escalationReason ? <span>Reason: {result.escalationReason}</span> : null}
                <span>Lead: {result.leadId ?? "none"}</span>
                <span>Task: {result.taskId ?? "none"}</span>
                <span>Provider: {result.aiProvider ?? "none"}</span>
                <span>Model: {result.aiModel ?? "none"}</span>
                <span>Fallback: {result.usedFallback ? "yes" : "no"}</span>
              </div>
              {result.citations.map((citation, index) => (
                <div className="source-item" key={`${citation.sourceTitle}-${index}`}>
                  <strong>{citation.sourceTitle}</strong>
                  <span>Knowledge score {citation.score.toFixed(2)}</span>
                  <p>{citation.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Send a message to test provider-backed output or deterministic fallback.</p>
          )}
        </article>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="grid two-columns">
        <article className="card">
          <h2>Conversații</h2>
          <div className="source-list">
            {conversations.length ? conversations.map((conversation) => (
              <div className="source-item" key={conversation.id}>
                <button className="ghost-button reset-button" onClick={() => setActiveConversationId(conversation.id)} type="button">
                  <strong>{conversation.customerName || conversation.customerEmail || conversation.id}</strong>
                  <span>{conversation.status} · {conversation.messages.length} messages</span>
                  {conversation.escalationReason ? <span>{conversation.escalationReason}</span> : null}
                  {conversation.lead ? <span>Lead score {conversation.lead.score} · {conversation.lead.status}</span> : null}
                </button>
                <div className="mini-actions">
                  <button className="button secondary mini" type="button" onClick={() => updateConversation(conversation.id, "OPEN")}>Deschide</button>
                  <button className="button secondary mini" type="button" onClick={() => updateConversation(conversation.id, "WAITING_FOR_HUMAN")}>Transfer uman</button>
                  <button className="button secondary mini" type="button" onClick={() => updateConversation(conversation.id, "CLOSED")}>Închide</button>
                </div>
              </div>
            )) : <p>No conversations yet.</p>}
          </div>
        </article>

        <form className="card form-section" onSubmit={onHumanReply}>
          <h2>Răspuns uman</h2>
          <p>{activeConversationId ? `Selected conversation: ${activeConversationId}` : "Select a conversation first."}</p>
          <textarea name="content" placeholder="Scrie un răspuns uman sau o notă de transfer." required />
          <input name="internalNote" placeholder="Notă internă, opțional" />
          <button className="button" type="submit">Adaugă răspuns uman</button>
        </form>
      </section>

      <section className="grid two-columns">
        <article className="card">
          <h2>Sarcini</h2>
          <div className="source-list">
            {tasks.length ? tasks.map((task) => (
              <div className="source-item" key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.priority} · {task.status}</span>
                {task.ownerNote ? <span>{task.ownerNote}</span> : null}
                <p>{task.description}</p>
                <div className="mini-actions">
                  <button className="button secondary mini" type="button" onClick={() => updateTask(task.id, "OPEN")}>Deschide</button>
                  <button className="button secondary mini" type="button" onClick={() => updateTask(task.id, "DONE")}>Finalizează</button>
                  <button className="button secondary mini" type="button" onClick={() => updateTask(task.id, "CANCELLED")}>Anulează</button>
                </div>
              </div>
            )) : <p>Nu există încă sarcini pentru Recepționerul AI.</p>}
          </div>
        </article>

        <article className="card">
          <h2>Leaduri</h2>
          <div className="source-list">
            {leads.length ? leads.map((lead) => (
              <div className="source-item" key={lead.id}>
                <strong>{lead.name || lead.email || lead.id}</strong>
                <span>Score {lead.score} · {lead.status}</span>
                {lead.ownerNote ? <span>{lead.ownerNote}</span> : null}
                <p>{lead.summary}</p>
                <div className="mini-actions">
                  <button className="button secondary mini" type="button" onClick={() => updateLead(lead.id, "QUALIFIED")}>Califică</button>
                  <button className="button secondary mini" type="button" onClick={() => updateLead(lead.id, "CONVERTED")}>Convertește</button>
                  <button className="button secondary mini" type="button" onClick={() => updateLead(lead.id, "DISQUALIFIED")}>Descalifică</button>
                </div>
              </div>
            )) : <p>No leads detected yet.</p>}
          </div>
        </article>
      </section>
    </div>
  );
}
