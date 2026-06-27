"use client";

import { useEffect, useState } from "react";

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

export function BillingClient() {
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
    if (!accessToken) throw new Error("Please log in before viewing billing.");
    return fetch(`${API_URL}${path}`, { ...init, headers: { Authorization: `Bearer ${accessToken}`, ...(init.headers ?? {}) } });
  }

  async function loadBilling(organizationId: string) {
    const response = await authedFetch(`/billing/organization/${organizationId}`);
    const json = await response.json();
    if (!response.ok) throw new Error(json.message ?? "Could not load billing");
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
    if (!response.ok) throw new Error(json.message ?? "Could not update plan");
    setBilling(json);
  }

  useEffect(() => {
    const accessToken = token();
    if (!accessToken) {
      setError("Please log in before viewing billing.");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.message ?? "Could not load session");
        setUser(json);
        const primary = json.memberships?.[0]?.organization;
        if (primary) await loadBilling(primary.id);
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Could not load billing"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading billing...</p>;

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
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">BUILD #017 Billing</div>
        <h1>Plans and usage.</h1>
        <p>{billing ? `${billing.organization.name} is on ${billing.organization.billingPlan} / ${billing.organization.billingStatus}` : "No billing data loaded."}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      {billing ? (
        <>
          <section className="grid">
            <UsageCard label="Widget messages" used={billing.usage.widgetMessages} limit={billing.limits.widgetMessages} remaining={billing.remaining.widgetMessages} over={billing.overLimit.widgetMessages} />
            <UsageCard label="Knowledge sources" used={billing.usage.knowledgeSources} limit={billing.limits.knowledgeSources} remaining={billing.remaining.knowledgeSources} over={billing.overLimit.knowledgeSources} />
            <UsageCard label="Team members" used={billing.usage.teamMembers} limit={billing.limits.teamMembers} remaining={billing.remaining.teamMembers} over={billing.overLimit.teamMembers} />
          </section>

          <section className="grid two-columns">
            {billing.plans.map((plan) => (
              <article className="card" key={plan.plan}>
                <h2>{plan.plan}</h2>
                <p>{plan.limits.widgetMessages.toLocaleString()} widget messages / period</p>
                <p>{plan.limits.knowledgeSources.toLocaleString()} knowledge sources</p>
                <p>{plan.limits.teamMembers.toLocaleString()} team members</p>
                <button className="button" type="button" onClick={() => updatePlan(plan.plan).catch((caughtError) => setError(String(caughtError)))}>
                  {billing.organization.billingPlan === plan.plan ? "Current plan" : `Switch to ${plan.plan}`}
                </button>
              </article>
            ))}
          </section>
        </>
      ) : null}
    </div>
  );
}

function UsageCard(props: { label: string; used: number; limit: number; remaining: number; over: boolean }) {
  return (
    <article className="card">
      <h3>{props.label}</h3>
      <div className="metric">{props.used}</div>
      <p>Limit: {props.limit.toLocaleString()}</p>
      <p>Remaining: {props.remaining.toLocaleString()}</p>
      {props.over ? <p className="form-error">Limit reached.</p> : null}
    </article>
  );
}
