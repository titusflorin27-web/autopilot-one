"use client";

import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type PublicReceptionResponse = {
  conversationId: string;
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  escalationReason?: string | null;
  aiProvider?: string;
  aiModel?: string;
  usedFallback?: boolean;
  citations: Array<{
    sourceTitle: string;
    score: number;
  }>;
};

type ChatMessage = {
  sender: "customer" | "ai";
  content: string;
};

export function WidgetDemoClient() {
  const [organizationSlug, setOrganizationSlug] = useState("demo-company");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastResponse, setLastResponse] = useState<PublicReceptionResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSending(true);

    const formData = new FormData(event.currentTarget);
    const message = String(formData.get("message") ?? "").trim();

    if (!message) {
      setError("Message is required.");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/public/reception-ai/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationSlug,
          customerName: customerName || undefined,
          customerEmail: customerEmail || undefined,
          conversationId: conversationId ?? undefined,
          websiteUrl: typeof window !== "undefined" ? window.location.href : undefined,
          message,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Reception AI could not answer.");
      }

      setConversationId(data.conversationId);
      setLastResponse(data);
      setMessages((current) => [
        ...current,
        { sender: "customer", content: message },
        { sender: "ai", content: data.reply },
      ]);
      event.currentTarget.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Reception AI could not answer.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">BUILD #009 Public Web Intake</div>
        <h1>Embeddable Reception AI intake.</h1>
        <p>This demo calls the public website endpoint and creates real Reception AI conversations.</p>
      </section>

      <section className="grid two-columns">
        <article className="card">
          <h3>Widget configuration</h3>
          <input value={organizationSlug} onChange={(event) => setOrganizationSlug(event.target.value)} placeholder="Organization slug" />
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name" />
          <input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Customer email" type="email" />
          <p>Use your organization slug from registration. For local test, create/register a company and copy its slug from dashboard data.</p>
        </article>

        <article className="widget-shell">
          <div className="widget-header">
            <strong>Reception AI</strong>
            <span>{lastResponse?.usedFallback ? "Fallback mode" : lastResponse?.aiProvider ?? "Public intake"}</span>
          </div>

          <div className="widget-messages">
            {messages.length ? messages.map((message, index) => (
              <div className={`widget-message ${message.sender}`} key={`${message.sender}-${index}`}>
                {message.content}
              </div>
            )) : (
              <p>Ask a question about services, pricing, booking or support.</p>
            )}
          </div>

          <form className="widget-input" onSubmit={onSubmit}>
            <input name="message" placeholder="Type your message..." />
            <button className="button mini" disabled={isSending} type="submit">Send</button>
          </form>

          {lastResponse ? (
            <div className="widget-meta">
              <span>Confidence {(lastResponse.confidence * 100).toFixed(0)}%</span>
              <span>Escalation {lastResponse.shouldEscalate ? "yes" : "no"}</span>
              <span>Conversation {lastResponse.conversationId.slice(0, 8)}</span>
            </div>
          ) : null}
        </article>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="card">
        <h2>Embed contract</h2>
        <p>Public websites call:</p>
        <pre className="code-block">{`POST /api/public/reception-ai/message
{
  "organizationSlug": "your-company-slug",
  "message": "Customer question",
  "customerName": "Optional name",
  "customerEmail": "Optional email",
  "conversationId": "Optional follow-up conversation id",
  "websiteUrl": "https://customer-site.example"
}`}</pre>
      </section>
    </div>
  );
}
