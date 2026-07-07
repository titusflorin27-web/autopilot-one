"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { billingLaunchCopy, packagePricingCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type Membership = { organization: { id: string; name: string } };
type CurrentUser = { memberships: Membership[] };
type Plan = "FREE" | "STARTER" | "PRO" | "BUSINESS";
type BillingOverview = {
  organization: {
    id: string;
    name: string;
    slug: string;
    billingPlan: Plan;
    billingStatus: string;
    billingCurrentPeriodStart: string;
    billingCurrentPeriodEnd?: string | null;
    hasStripeCustomer?: boolean;
    hasStripeSubscription?: boolean;
    hasStripePrice?: boolean;
  };
  limits: { widgetMessages: number; knowledgeSources: number; teamMembers: number };
  usage: { widgetMessages: number; knowledgeSources: number; teamMembers: number };
  remaining: { widgetMessages: number; knowledgeSources: number; teamMembers: number };
  overLimit: { widgetMessages: boolean; knowledgeSources: boolean; teamMembers: boolean };
  plans: Array<{ plan: Plan; limits: { widgetMessages: number; knowledgeSources: number; teamMembers: number } }>;
  paymentProvider?: {
    provider: "stripe";
    configured: boolean;
    checkoutEnabled: boolean;
    portalEnabled: boolean;
  };
};

type BillingCopy = typeof billingLaunchCopy["ro"]["billing"];
type PackageCopy = typeof packagePricingCopy["ro"];
type PackagePlan = PackageCopy["plans"][number];

function getPlanCopy(copy: PackageCopy, plan: Plan): PackagePlan | undefined {
  return copy.plans.find((item) => item.plan === plan);
}

export function BillingClient() {
  const language = useAppLanguage();
  const copy = billingLaunchCopy[language].billing;
  const commonCopy = billingLaunchCopy[language].common;
  const packageCopy = packagePricingCopy[language];
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function startCheckout(plan: Plan) {
    if (!billing) return;

    if (!billing.paymentProvider?.checkoutEnabled) {
      throw new Error(copy.checkoutUnavailable);
    }

    setIsRedirecting(true);
    const response = await authedFetch(`/billing/organization/${billing.organization.id}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const json = await response.json() as { url?: string; message?: string };

    if (!response.ok || !json.url) {
      setIsRedirecting(false);
      throw new Error(json.message ?? copy.checkoutError);
    }

    window.location.assign(json.url);
  }

  async function openBillingPortal() {
    if (!billing) return;

    if (!billing.paymentProvider?.portalEnabled) {
      throw new Error(copy.portalUnavailable);
    }

    setIsRedirecting(true);
    const response = await authedFetch(`/billing/organization/${billing.organization.id}/portal`, { method: "POST" });
    const json = await response.json() as { url?: string; message?: string };

    if (!response.ok || !json.url) {
      setIsRedirecting(false);
      throw new Error(json.message ?? copy.portalError);
    }

    window.location.assign(json.url);
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

  if (isLoading) {
    return (
      <section className="card protected-loading-card">
        <div className="eyebrow">Se încarcă</div>
        <h1>Facturare</h1>
        <p>{copy.loading}</p>
        <p className="helper-text">Pregătim pachetele, limitele și statusul de facturare.</p>
      </section>
    );
  }

  if (error && !user) {
    return (
      <section className="card">
        <h1>{commonCopy.authTitle}</h1>
        <p>{error}</p>
        <a href="/login" className="button">{commonCopy.loginCta}</a>
      </section>
    );
  }

  const checkoutEnabled = Boolean(billing?.paymentProvider?.checkoutEnabled);
  const portalEnabled = Boolean(billing?.paymentProvider?.portalEnabled);

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

      <section className="card">
        <div className="eyebrow">{packageCopy.billingNoticeEyebrow}</div>
        <h2>{packageCopy.billingNoticeTitle}</h2>
        <p>{packageCopy.billingNoticeDescription}</p>
        <p className="helper-text">{checkoutEnabled ? copy.paymentProviderReady : copy.paymentProviderPending}</p>
        <div className="actions">
          {portalEnabled ? (
            <button
              className="button secondary"
              type="button"
              disabled={isRedirecting}
              onClick={() => openBillingPortal().catch((caughtError) => {
                setError(caughtError instanceof Error ? caughtError.message : copy.portalError);
              })}
            >
              {copy.manageBilling}
            </button>
          ) : (
            <Link href="/demo?source=billing" className="button secondary">{packageCopy.billingNoticeCta}</Link>
          )}
        </div>
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
            {billing.plans.map((plan) => {
              const planCopy = getPlanCopy(packageCopy, plan.plan);
              const isCurrentPlan = billing.organization.billingPlan === plan.plan;
              const canCheckout = checkoutEnabled && plan.plan !== "FREE" && plan.plan !== "BUSINESS";

              return (
                <article className="card" key={plan.plan}>
                  <h2>{planCopy?.name ?? plan.plan}</h2>
                  {planCopy ? (
                    <>
                      <div className="price">{planCopy.price}<span>{planCopy.period}</span></div>
                      <p className="plan-note">{planCopy.note}</p>
                    </>
                  ) : null}
                  <p>{plan.limits.widgetMessages.toLocaleString(locale)} {copy.widgetMessagesPerPeriod}</p>
                  <p>{plan.limits.knowledgeSources.toLocaleString(locale)} {copy.knowledgeSourcesUnit}</p>
                  <p>{plan.limits.teamMembers.toLocaleString(locale)} {copy.teamMembersUnit}</p>
                  {planCopy ? (
                    <ul className="check-list">
                      {planCopy.features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  ) : null}
                  {isCurrentPlan ? (
                    <>
                      <button className="button" type="button" disabled>{copy.currentPlan}</button>
                      <p className="helper-text">{copy.currentPlanHelp}</p>
                    </>
                  ) : canCheckout ? (
                    <button
                      className="button secondary"
                      type="button"
                      disabled={isRedirecting}
                      onClick={() => startCheckout(plan.plan).catch((caughtError) => {
                        setError(caughtError instanceof Error ? caughtError.message : copy.checkoutError);
                      })}
                    >
                      {copy.startCheckout}
                    </button>
                  ) : (
                    <Link href={`/demo?source=billing&plan=${plan.plan.toLowerCase()}`} className="button secondary">
                      {copy.requestPlan}
                    </Link>
                  )}
                </article>
              );
            })}
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
