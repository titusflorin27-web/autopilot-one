"use client";

import { useEffect, useState } from "react";
import { billingLaunchCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type Membership = { organization: { id: string; name: string } };
type CurrentUser = { memberships: Membership[] };
type Plan = "FREE" | "STARTER" | "PRO" | "BUSINESS";
type BillingOverview = {
  organization: { id: string; name: string; slug: string; billingPlan: Plan; billingStatus: string; billingCurrentPeriodStart: string };
  limits: { widgetMessages: number; knowledgeSources: number; teamMembers: number };
  usage: { widgetMessages: number; knowledgeSources: number; teamMembers: number };
  remaining: { widgetMessages: number; knowledgeSources: number; teamMembers: number };
  overLimit: { widgetMessages: boolean; knowledgeSources: boolean; teamMembers: boolean };
  plans: Array<{ plan: Plan; limits: { widgetMessages: number; knowledgeSources: number; teamMembers: number } }>;
};

type BillingCopy = typeof billingLaunchCopy["ro"]["billing"];

export function BillingClient() {
  const language = useAppLanguage();
  const copy = billingLaunchCopy[language].billing;
  const commonCopy = billingLaunchCopy[language].common;
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organization = user?.memberships[0]?.organization;

  function token() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function authedFetch(path: string, init: RequestInit = {}) {
    const accessToken = token();
    if (!accessToken) throw new Error(copy.loginRequired);
    return fetch(`${API_URL}${path}`, { ...init, headers: { Authorization: `Bearer ${accessToken}`, ...(init.headers ?? {}) } });
  }

  async function loadBilling(organizationId: string) {
    const response = await authedFetch(`/billing/organization/${organizationId}`);
    const json = await response.json();
    if (!response.ok) throw new Error(json.message ?? copy.loadBillingError);
    setBilling(json);
  }

  async function updatePlan(plan: Plan) {
    if (!organization) return;
    const response = await authedFetch(`/billing/organization/${organization.id}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message ?? copy.updatePlanError);
    setBilling(json);
  }

  useEffect(() => {
    const accessToken = token();
    if (!accessToken) {
      setError(copy.loginRequired);
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.message ?? copy.loadSessionError);
        setUser(json);
        const primary = json.memberships?.[0]?.organization;
        if (primary) await loadBilling(primary.id);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : copy.loadBillingError))
      .finally(() => setIsLoading(false));
  }, [copy.loadBillingError, copy.loadSessionError, copy.loginRequired]);

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
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>
          {billing
            ? `${billing.organization.name} · ${copy.planPrefix} ${billing.organization.billingPlan} · ${copy.statusPrefix} ${billing.organization.billingStatus}`
            : copy.noBilling}
        </p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {billing ? (
        <>
          <section className="grid">
            <UsageCard copy={copy} locale={locale} label={copy.widgetMessages} used={billing.usage.widgetMessages} limit={billing.limits.widgetMessages} remaining={billing.remaining.widgetMessages} over={billing.overLimit.widgetMessages} />
            <UsageCard copy={copy} locale={locale} label={copy.knowledgeSources} used={billing.usage.knowledgeSources} limit={billing.limits.knowledgeSources} remaining={billing.remaining.knowledgeSources} over={billing.overLimit.knowledgeSources} />
            <UsageCard copy={copy} locale={locale} label={copy.teamMembers} used={billing.usage.teamMembers} limit={billing.limits.teamMembers} remaining={billing.remaining.teamMembers} over={billing.overLimit.teamMembers} />
          </section>

          <section className="grid two-columns">
            {billing.plans.map((plan) => (
              <article className="card" key={plan.plan}>
                <h2>{plan.plan}</h2>
                <p>{plan.limits.widgetMessages.toLocaleString(locale)} {copy.widgetMessagesPerPeriod}</p>
                <p>{plan.limits.knowledgeSources.toLocaleString(locale)} {copy.knowledgeSourcesUnit}</p>
                <p>{plan.limits.teamMembers.toLocaleString(locale)} {copy.teamMembersUnit}</p>
                <button
                  className="button"
                  type="button"
                  onClick={() => updatePlan(plan.plan).catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : String(caughtError)))}
                >
                  {billing.organization.billingPlan === plan.plan ? copy.currentPlan : `${copy.switchTo} ${plan.plan}`}
                </button>
              </article>
            ))}
          </section>
        </>
      ) : null}
    </div>
  );
}

function UsageCard(props: { copy: BillingCopy; locale: string; label: string; used: number; limit: number; remaining: number; over: boolean }) {
  return (
    <article className="card">
      <h3>{props.label}</h3>
      <div className="metric">{props.used.toLocaleString(props.locale)}</div>
      <p>{props.copy.limit}: {props.limit.toLocaleString(props.locale)}</p>
      <p>{props.copy.remaining}: {props.remaining.toLocaleString(props.locale)}</p>
      {props.over ? <p className="form-error">{props.copy.overLimit}</p> : null}
    </article>
  );
}
