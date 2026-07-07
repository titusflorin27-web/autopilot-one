"use client";

import Link from "next/link";
import { packagePricingCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

export function PricingClient() {
  const language = useAppLanguage();
  const copy = packagePricingCopy[language];
  const activationCopy = language === "ro"
    ? {
        eyebrow: "Activare controlată",
        title: "Planurile plătite se activează prin demo înainte de plata online.",
        description: "Alegem pachetul potrivit, verificăm cazul de utilizare și pregătim configurarea comercială înainte de activarea finală.",
        cta: "Discută activarea",
      }
    : {
        eyebrow: "Controlled activation",
        title: "Paid plans start through demo before online payment.",
        description: "We choose the right package, validate the use case and prepare the commercial setup before final activation.",
        cta: "Discuss activation",
      };

  return (
    <main className="container page-stack">
      <section className="card hero-card pricing-hero">
        <div className="eyebrow">{copy.heroEyebrow}</div>
        <h1>
          {copy.heroTitlePrefix} <span className="gradient-text">{copy.heroTitleHighlight}</span>
        </h1>
        <p className="lead-text">{copy.heroDescription}</p>
        <div className="actions">
          <Link href="/demo" className="button">{copy.requestDemo}</Link>
          <Link href="/terms" className="button secondary">{copy.viewTerms}</Link>
        </div>
        <div className="launch-kicker">
          {copy.badges.map((badge) => <span key={badge}>{badge}</span>)}
        </div>
      </section>

      <section className="card cta-card">
        <div>
          <div className="eyebrow">{activationCopy.eyebrow}</div>
          <h2>{activationCopy.title}</h2>
          <p>{activationCopy.description}</p>
        </div>
        <Link href="/demo" className="button secondary">{activationCopy.cta}</Link>
      </section>

      <section className="pricing-grid" aria-label={copy.planSectionTitle}>
        {copy.plans.map((plan) => (
          <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.plan}>
            {plan.featured ? <span className="status-pill">{copy.recommended}</span> : null}
            <h2>{plan.name}</h2>
            <div className="price">{plan.price}<span>{plan.period}</span></div>
            <p className="plan-note">{plan.note}</p>
            <p className="helper-text">{copy.included}</p>
            <ul className="check-list">
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <div className="actions">
              <Link href={`/demo?plan=${plan.plan.toLowerCase()}`} className="button secondary">
                {copy.discussPlan}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="grid three-columns">
        {copy.principles.map((principle) => (
          <article className="card" key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </article>
        ))}
      </section>

      <section className="card cta-card">
        <div>
          <div className="eyebrow">{copy.ctaEyebrow}</div>
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaDescription}</p>
        </div>
        <Link href="/demo" className="button">{copy.ctaButton}</Link>
      </section>
    </main>
  );
}
