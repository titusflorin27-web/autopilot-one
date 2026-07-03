"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { widgetPagesCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type PublicReceptionResponse = {
  conversationId: string;
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  escalationReason?: string | null;
  aiProvider?: string;
  aiModel?: string;
  usedFallback?: boolean;
  rateLimit?: {
    windowSeconds: number;
    max: number;
  };
  citations: Array<{
    sourceTitle: string;
    score: number;
  }>;
};

type ChatMessage = {
  sender: "customer" | "ai";
  content: string;
};

function createVisitorId() {
  return `visitor_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function WidgetDemoClient() {
  const language = useAppLanguage();
  const copy = widgetPagesCopy[language].demo;

  const [organizationSlug, setOrganizationSlug] = useState("autopilot-one");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [widgetToken, setWidgetToken] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastResponse, setLastResponse] = useState<PublicReceptionResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanOrganizationSlug = organizationSlug.trim();
  const cleanWidgetToken = widgetToken.trim();
  const embedSnippet = `<script\n  src="${APP_URL}/autopilot-widget.js"\n  data-organization-slug="${cleanOrganizationSlug}"\n  data-api-url="${API_URL}"\n  data-title="${copy.widgetTitle}"${cleanWidgetToken ? `\n  data-widget-token="${cleanWidgetToken}"` : ""}\n  async\n></script>`;

  useEffect(() => {
    const storageKey = "autopilot.publicVisitorId";
    const existing = window.localStorage.getItem(storageKey);
    const nextVisitorId = existing ?? createVisitorId();

    window.localStorage.setItem(storageKey, nextVisitorId);
    setVisitorId(nextVisitorId);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setIsSending(true);

    const formData = new FormData(form);
    const message = String(formData.get("message") ?? "").trim();

    if (!message) {
      setError(copy.messageRequired);
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/public/reception-ai/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationSlug: cleanOrganizationSlug,
          customerName: customerName.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          conversationId: conversationId ?? undefined,
          visitorId: visitorId || undefined,
          widgetToken: cleanWidgetToken || undefined,
          websiteUrl: typeof window !== "undefined" ? window.location.href : undefined,
          message,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? copy.replyError);
      }

      setConversationId(data.conversationId);
      setLastResponse(data);
      setMessages((current) => [
        ...current,
        { sender: "customer", content: message },
        { sender: "ai", content: data.reply },
      ]);
      form.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.replyError);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </section>

      <section className="grid two-columns">
        <article className="card">
          <h3>{copy.configurationTitle}</h3>
          <input value={organizationSlug} onChange={(event) => setOrganizationSlug(event.target.value)} placeholder={copy.organizationSlugPlaceholder} />
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder={copy.customerNamePlaceholder} />
          <input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder={copy.customerEmailPlaceholder} type="email" />
          <input value={widgetToken} onChange={(event) => setWidgetToken(event.target.value)} placeholder={copy.widgetTokenPlaceholder} />
          <p>{copy.visitorId}: {visitorId || copy.creating}</p>
          <p>{copy.installHint}</p>
        </article>

        <article className="widget-shell">
          <div className="widget-header">
            <strong>{copy.widgetTitle}</strong>
            <span>{lastResponse?.usedFallback ? copy.fallbackMode : lastResponse?.aiProvider ?? copy.publicIntake}</span>
          </div>

          <div className="widget-messages">
            {messages.length ? messages.map((message, index) => (
              <div className={`widget-message ${message.sender}`} key={`${message.sender}-${index}`}>
                {message.content}
              </div>
            )) : (
              <p>{copy.emptyChat}</p>
            )}
          </div>

          <form className="widget-input" onSubmit={onSubmit}>
            <input name="message" placeholder={copy.messagePlaceholder} />
            <button className="button mini" disabled={isSending} type="submit">{copy.send}</button>
          </form>

          {lastResponse ? (
            <div className="widget-meta">
              <span>{copy.confidence} {(lastResponse.confidence * 100).toFixed(0)}%</span>
              <span>{copy.escalation} {lastResponse.shouldEscalate ? copy.yes : copy.no}</span>
              <span>{copy.conversation} {lastResponse.conversationId.slice(0, 8)}</span>
              {lastResponse.rateLimit ? <span>{copy.limit} {lastResponse.rateLimit.max}/{lastResponse.rateLimit.windowSeconds}s</span> : null}
            </div>
          ) : null}
        </article>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="grid two-columns">
        <article className="card">
          <h2>{copy.snippetTitle}</h2>
          <p>{copy.snippetDescription}</p>
          <pre className="code-block">{embedSnippet}</pre>
        </article>

        <article className="card">
          <h2>{copy.publicApiTitle}</h2>
          <pre className="code-block">{`POST /api/public/reception-ai/message
{
  "organizationSlug": "slug-companie",
  "message": "Întrebarea clientului",
  "conversationId": "${copy.sampleConversationId}",
  "visitorId": "${copy.sampleVisitorId}",
  "customerName": "${copy.sampleCustomerName}",
  "customerEmail": "${copy.sampleCustomerEmail}",
  "widgetToken": "${copy.sampleWidgetToken}",
  "websiteUrl": "https://customer-site.example"
}`}</pre>
        </article>
      </section>
    </div>
  );
}
