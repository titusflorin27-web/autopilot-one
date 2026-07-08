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
        title: "Planurile sunt pregătite pentru discuție comercială și activare manuală după demo.",
        description: "Confirmăm cazul de utilizare, limitele, setup-ul și facturarea înainte de orice plată online sau abonament automat.",
        cta: "Discută activarea",
      }
    : {
        eyebrow: "Controlled activation",
        title: "Plans are ready for commercial discussion and manual activation after demo.",
        description: "We confirm the use case, limits, setup and billing before any online payment or automatic subscription.",
        cta: "Discuss activation",
      };
  const commercialCopy = language === "ro"
    ? {
        notesTitle: "Note comerciale pentru lansarea controlată",
        pilotHelper: "Validare inițială: nu este un plan gratuit permanent pentru producție.",
        paidHelper: "Setup ghidat inclus în perioada de lansare controlată.",
        businessHelper: "Volumul, SLA-ul și suportul se stabilesc separat după demo.",
        cards: [
          {
            title: "Activare după demo",
            description: "Prețul, planul și facturarea sunt confirmate manual înainte de activarea finală.",
          },
          {
            title: "Limite clare pe lună",
            description: "Mesajele widget sunt exprimate lunar. Depășirile duc la upgrade sau ajustare manuală, nu la taxare automată fără confirmare.",
          },
          {
            title: "Surse de cunoștințe explicate",
            description: "Sursele pot fi pagini, documente sau intrări în baza de cunoștințe folosite ca context pentru recepționerul AI.",
          },
        ],
      }
    : {
        notesTitle: "Commercial notes for controlled launch",
        pilotHelper: "Initial validation: not a permanent free production plan.",
        paidHelper: "Guided setup included during the controlled launch period.",
        businessHelper: "Volume, SLA and support are agreed separately after the demo.",
        cards: [
          {
            title: "Activation after demo",
            description: "Price, plan and billing are confirmed manually before final activation.",
          },
          {
            title: "Clear monthly limits",
            description: "Widget messages are expressed monthly. Overages trigger manual upgrade or adjustment, not automatic extra charges without confirmation.",
          },
          {
            title: "Knowledge sources clarified",
            description: "Sources can be pages, documents or knowledge base entries used as context for the AI receptionist.",
          },
        ],
      };

  const planName = (plan: (typeof copy.plans)[number]) =>
    plan.plan === "FREE" ? "Pilot" : plan.name;

  const planPeriod = (plan: (typeof copy.plans)[number]) => {
    if (plan.plan === "FREE") {
      return language === "ro" ? " / validare" : " / validation";
    }

    return plan.period;
  };

  const planHelper = (plan: (typeof copy.plans)[number]) => {
    if (plan.plan === "FREE") {
      return commercialCopy.pilotHelper;
    }

    if (plan.plan === "BUSINESS") {
      return commercialCopy.businessHelper;
    }

    return commercialCopy.paidHelper;
  };

  const featureLabel = (feature: string) => feature
    .replace("widget messages / period", "widget messages / month")
    .replace("mesaje widget / perioadă", "mesaje widget / lună")
    .replace("knowledge sources", "knowledge sources (pages, docs or KB entries)")
    .replace("surse de cunoștințe", "surse de cunoștințe (pagini, documente sau intrări KB)");

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
            <h2>{planName(plan)}</h2>
            <div className="price">{plan.price}<span>{planPeriod(plan)}</span></div>
            <p className="plan-note">{plan.note}</p>
            <p className="helper-text">{planHelper(plan)}</p>
            <p className="helper-text">{copy.included}</p>
            <ul className="check-list">
              {plan.features.map((feature) => <li key={feature}>{featureLabel(feature)}</li>)}
            </ul>
            <div className="actions">
              <Link href={`/demo?plan=${plan.plan.toLowerCase()}`} className="button secondary">
                {copy.discussPlan}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="grid three-columns" aria-label={commercialCopy.notesTitle}>
        {commercialCopy.cards.map((note) => (
          <article className="card" key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
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
