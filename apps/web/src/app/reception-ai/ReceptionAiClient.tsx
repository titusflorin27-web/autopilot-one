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
  leadId?: string | null;
  taskId?: string | null;
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
  messages: Array<{ id: string; sender: string; content: string }>;
  lead?: { id: string; score: number; status: string } | null;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
};

export function ReceptionAiClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
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
      throw new Error("Please log in before using Reception AI.");
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
    const [conversationsResponse, tasksResponse] = await Promise.all([
      apiFetch(`/reception-ai/organization/${organizationId}/conversations`),
      apiFetch(`/reception-ai/organization/${organizationId}/tasks`),
    ]);

    const conversationsData = await conversationsResponse.json();
    const tasksData = await tasksResponse.json();

    if (!conversationsResponse.ok) {
      throw new Error(conversationsData.message ?? "Could not load conversations");
    }

    if (!tasksResponse.ok) {
      throw new Error(tasksData.message ?? "Could not load tasks");
    }

    setConversations(conversationsData);
    setTasks(tasksData);
  }

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("Please log in before using Reception AI.");
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
        setError(caughtError instanceof Error ? caughtError.message : "Could not load Reception AI");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!primaryMembership) {
      setError("No organization found for this account.");
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
        throw new Error(data.message ?? "Reception AI failed");
      }

      setResult(data);
      setActiveConversationId(data.conversationId);
      await loadReceptionState(primaryMembership.organization.id);
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Reception AI failed");
    } finally {
      setIsSending(false);
    }
  }

  if (isLoading) {
    return <p>Loading Reception AI...</p>;
  }

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
    <div className="reception-layout">
      <section className="card">
        <div className="eyebrow">BUILD #006 Reception AI</div>
        <h1>Your first AI Employee is live.</h1>
        <p>{primaryMembership ? `Workspace: ${primaryMembership.organization.name}` : "No organization found."}</p>
      </section>

      <section className="grid two-columns">
        <form className="card form-section" onSubmit={onSubmit}>
          <h3>Simulate customer message</h3>
          <input name="customerName" placeholder="Customer name" />
          <input name="customerEmail" placeholder="Customer email" type="email" />
          <textarea name="message" placeholder="Example: I need pricing and a demo for my company next week." required />
          <button className="button" type="submit" disabled={isSending}>
            {isSending ? "Reception AI is thinking..." : "Send to Reception AI"}
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
                <span>Lead: {result.leadId ?? "none"}</span>
                <span>Task: {result.taskId ?? "none"}</span>
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
            <p>Send a message to generate the first Reception AI response.</p>
          )}
        </article>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="grid two-columns">
        <article className="card">
          <h2>Conversations</h2>
          <div className="source-list">
            {conversations.length ? conversations.map((conversation) => (
              <button className="source-item ghost-button" key={conversation.id} onClick={() => setActiveConversationId(conversation.id)} type="button">
                <strong>{conversation.customerName || conversation.customerEmail || conversation.id}</strong>
                <span>{conversation.status} · {conversation.messages.length} messages</span>
                {conversation.lead ? <span>Lead score {conversation.lead.score} · {conversation.lead.status}</span> : null}
              </button>
            )) : <p>No conversations yet.</p>}
          </div>
        </article>

        <article className="card">
          <h2>Tasks</h2>
          <div className="source-list">
            {tasks.length ? tasks.map((task) => (
              <div className="source-item" key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.priority} · {task.status}</span>
                <p>{task.description}</p>
              </div>
            )) : <p>No Reception AI tasks yet.</p>}
          </div>
        </article>
      </section>
    </div>
  );
}
