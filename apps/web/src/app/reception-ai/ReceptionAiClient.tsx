"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { receptionAiCopy } from "../../lib/i18n";
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

type ReceptionCopy = typeof receptionAiCopy["ro"];

function statusLabel(status: string, copy: ReceptionCopy) {
  switch (status) {
    case "OPEN":
      return copy.statusOpen;
    case "WAITING_FOR_HUMAN":
      return copy.statusWaitingForHuman;
    case "CLOSED":
      return copy.statusClosed;
    case "DONE":
      return copy.statusDone;
    case "CANCELLED":
      return copy.statusCancelled;
    case "NEW":
      return copy.statusNew;
    case "QUALIFIED":
      return copy.statusQualified;
    case "WON":
      return copy.statusWon;
    case "LOST":
      return copy.statusLost;
    default:
      return status;
  }
}

function priorityLabel(priority: string, copy: ReceptionCopy) {
  switch (priority) {
    case "LOW":
      return copy.priorityLow;
    case "MEDIUM":
      return copy.priorityMedium;
    case "HIGH":
      return copy.priorityHigh;
    default:
      return priority;
  }
}

export function ReceptionAiClient() {
  const language = useAppLanguage();
  const copy = receptionAiCopy[language];

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [summary, setSummary] = useState<OperationsSummary | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
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
      throw new Error(summaryData.message ?? copy.loadSummaryError);
    }

    if (!conversationsResponse.ok) {
      throw new Error(conversationsData.message ?? copy.loadConversationsError);
    }

    if (!tasksResponse.ok) {
      throw new Error(tasksData.message ?? copy.loadTasksError);
    }

    if (!leadsResponse.ok) {
      throw new Error(leadsData.message ?? copy.loadLeadsError);
    }

    setSummary(summaryData);
    setConversations(conversationsData);
    setTasks(tasksData);
    setLeads(leadsData);
  }

  async function refresh() {
    if (primaryMembership) {
      await loadReceptionState(primaryMembership.organization.id);
    }
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
          await loadReceptionState(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : copy.loadReceptionError);
      })
      .finally(() => setIsLoading(false));
  }, [copy.loadReceptionError, copy.loadSessionError, copy.loginRequired]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!primaryMembership) {
      setError(copy.organizationMissing);
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
        throw new Error(data.message ?? copy.aiReplyError);
      }

      setResult(data);
      setActiveConversationId(data.conversationId);
      await loadReceptionState(primaryMembership.organization.id);
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.aiReplyError);
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
      throw new Error(data.message ?? copy.operationFailed);
    }

    await refresh();
  }

  async function updateConversation(conversationId: string, status: string) {
    try {
      await patchJson(`/reception-ai/conversations/${conversationId}`, { status });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.updateConversationError);
    }
  }

  async function updateTask(taskId: string, status: string) {
    try {
      await patchJson(`/reception-ai/tasks/${taskId}`, { status });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.updateTaskError);
    }
  }

  async function updateLead(leadId: string, status: string) {
    try {
      await patchJson(`/reception-ai/leads/${leadId}`, { status });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.updateLeadError);
    }
  }

  async function onHumanReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!activeConversationId) {
      setError(copy.selectConversationBeforeReply);
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
        throw new Error(data.message ?? copy.addHumanReplyError);
      }

      await refresh();
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.addHumanReplyError);
    }
  }

  if (isLoading) {
    return <p>{copy.loading}</p>;
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
    <div className="reception-layout">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>{primaryMembership ? `${copy.workspacePrefix}: ${primaryMembership.organization.name}` : copy.organizationMissing}</p>
      </section>

      <section className="grid">
        <article className="card">
          <h3>{copy.waitingForHuman}</h3>
          <div className="metric">{summary?.conversations?.WAITING_FOR_HUMAN ?? 0}</div>
        </article>
        <article className="card">
          <h3>{copy.openTasks}</h3>
          <div className="metric">{summary?.tasks?.OPEN ?? 0}</div>
        </article>
        <article className="card">
          <h3>{copy.lastAiMode}</h3>
          <div className="metric">{result?.usedFallback ? copy.fallback : result?.aiProvider ?? copy.none}</div>
        </article>
      </section>

      <section className="grid two-columns">
        <form className="card form-section" onSubmit={onSubmit}>
          <h3>{copy.simulateTitle}</h3>
          <input name="customerName" placeholder={copy.customerNamePlaceholder} />
          <input name="customerEmail" placeholder={copy.customerEmailPlaceholder} type="email" />
          <textarea name="message" placeholder={copy.messagePlaceholder} required />
          <button className="button" type="submit" disabled={isSending}>
            {isSending ? copy.thinking : copy.sendToAi}
          </button>
        </form>

        <article className="card">
          <h3>{copy.aiResponseTitle}</h3>
          {result ? (
            <div className="source-list">
              <div className="source-item">
                <strong>{copy.reply}</strong>
                <p>{result.reply}</p>
                <span>{copy.confidence}: {(result.confidence * 100).toFixed(0)}%</span>
                <span>{copy.escalation}: {result.shouldEscalate ? copy.yes : copy.no}</span>
                {result.escalationReason ? <span>{copy.reason}: {result.escalationReason}</span> : null}
                <span>{copy.lead}: {result.leadId ?? copy.none}</span>
                <span>{copy.task}: {result.taskId ?? copy.none}</span>
                <span>{copy.provider}: {result.aiProvider ?? copy.none}</span>
                <span>{copy.model}: {result.aiModel ?? copy.none}</span>
                <span>{copy.fallback}: {result.usedFallback ? copy.yes : copy.no}</span>
              </div>
              {result.citations.map((citation, index) => (
                <div className="source-item" key={`${citation.sourceTitle}-${index}`}>
                  <strong>{citation.sourceTitle}</strong>
                  <span>{copy.knowledgeScore} {citation.score.toFixed(2)}</span>
                  <p>{citation.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{copy.emptyAiResponse}</p>
          )}
        </article>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="grid two-columns">
        <article className="card">
          <h2>{copy.conversationsTitle}</h2>
          <div className="source-list">
            {conversations.length ? conversations.map((conversation) => (
              <div className="source-item" key={conversation.id}>
                <button className="ghost-button reset-button" onClick={() => setActiveConversationId(conversation.id)} type="button">
                  <strong>{conversation.customerName || conversation.customerEmail || conversation.id}</strong>
                  <span>{statusLabel(conversation.status, copy)} · {conversation.messages.length} {copy.messages}</span>
                  {conversation.escalationReason ? <span>{conversation.escalationReason}</span> : null}
                  {conversation.lead ? <span>{copy.leadScore} {conversation.lead.score} · {statusLabel(conversation.lead.status, copy)}</span> : null}
                </button>
                <div className="mini-actions">
                  <button className="button secondary mini" type="button" onClick={() => updateConversation(conversation.id, "OPEN")}>{copy.open}</button>
                  <button className="button secondary mini" type="button" onClick={() => updateConversation(conversation.id, "WAITING_FOR_HUMAN")}>{copy.humanTransfer}</button>
                  <button className="button secondary mini" type="button" onClick={() => updateConversation(conversation.id, "CLOSED")}>{copy.close}</button>
                </div>
              </div>
            )) : <p>{copy.noConversations}</p>}
          </div>
        </article>

        <form className="card form-section" onSubmit={onHumanReply}>
          <h2>{copy.humanReplyTitle}</h2>
          <p>{activeConversationId ? `${copy.selectedConversation}: ${activeConversationId}` : copy.selectConversationFirst}</p>
          <textarea name="content" placeholder={copy.humanReplyPlaceholder} required />
          <input name="internalNote" placeholder={copy.internalNotePlaceholder} />
          <button className="button" type="submit">{copy.addHumanReply}</button>
        </form>
      </section>

      <section className="grid two-columns">
        <article className="card">
          <h2>{copy.tasksTitle}</h2>
          <div className="source-list">
            {tasks.length ? tasks.map((task) => (
              <div className="source-item" key={task.id}>
                <strong>{task.title}</strong>
                <span>{priorityLabel(task.priority, copy)} · {statusLabel(task.status, copy)}</span>
                {task.ownerNote ? <span>{task.ownerNote}</span> : null}
                <p>{task.description}</p>
                <div className="mini-actions">
                  <button className="button secondary mini" type="button" onClick={() => updateTask(task.id, "OPEN")}>{copy.open}</button>
                  <button className="button secondary mini" type="button" onClick={() => updateTask(task.id, "DONE")}>{copy.done}</button>
                  <button className="button secondary mini" type="button" onClick={() => updateTask(task.id, "CANCELLED")}>{copy.cancel}</button>
                </div>
              </div>
            )) : <p>{copy.noTasks}</p>}
          </div>
        </article>

        <article className="card">
          <h2>{copy.leadsTitle}</h2>
          <div className="source-list">
            {leads.length ? leads.map((lead) => (
              <div className="source-item" key={lead.id}>
                <strong>{lead.name || lead.email || lead.id}</strong>
                <span>{statusLabel(lead.status, copy)} · {copy.score} {lead.score}</span>
                {lead.ownerNote ? <span>{lead.ownerNote}</span> : null}
                <p>{lead.summary}</p>
                <div className="mini-actions">
                  <button className="button secondary mini" type="button" onClick={() => updateLead(lead.id, "QUALIFIED")}>{copy.qualify}</button>
                  <button className="button secondary mini" type="button" onClick={() => updateLead(lead.id, "WON")}>{copy.won}</button>
                  <button className="button secondary mini" type="button" onClick={() => updateLead(lead.id, "LOST")}>{copy.lost}</button>
                </div>
              </div>
            )) : <p>{copy.noLeads}</p>}
          </div>
        </article>
      </section>
    </div>
  );
}
