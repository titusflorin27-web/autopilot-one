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
        description: "Confirmăm cazul de utilizare, limitele, setup-ul și facturarea înainte de orice plată online sau abonament automat.",
        cta: "Discută activarea",
      }
    : {
        eyebrow: "Controlled activation",
        title: "Paid plans start through demo before online payment.",
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
  const planStepsCopy = language === "ro"
    ? {
        eyebrow: "Pașii clientului",
        title: "Ce ai de făcut după alegerea planului",
        description: "Procesul este ghidat. Clientul confirmă informațiile esențiale, iar Autopilot One pregătește agentul AI, baza de cunoștințe și instalarea widgetului.",
        plans: [
          {
            title: "Pilot",
            description: "Pentru validare inițială înainte de un plan plătit.",
            steps: [
              "Confirmi website-ul și datele de contact.",
              "Răspunzi la câteva întrebări despre business.",
              "Aprobi profilul AI generat pentru test.",
              "Testezi o conversație și decizi dacă trecem la Starter.",
            ],
          },
          {
            title: "Starter",
            description: "Pentru primul flux real de AI pe website.",
            steps: [
              "Confirmi firma, domeniul și persoana responsabilă.",
              "Adaugi serviciile, FAQ-ul și regulile principale.",
              "Aprobi baza de cunoștințe creată de AI.",
              "Instalezi widgetul sau trimiți instrucțiunile developerului.",
              "Trimiți un mesaj de test și aprobi go-live.",
            ],
          },
          {
            title: "Pro",
            description: "Pentru volum, inbox, analytics și follow-up organizat.",
            steps: [
              "Confirmi echipa, rolurile și fluxul de follow-up.",
              "Adaugi surse extinse și reguli pentru transfer uman.",
              "Testezi lead capture, inbox, notificări și analytics.",
              "Aprobi lansarea și primești raport de optimizare.",
            ],
          },
          {
            title: "Business",
            description: "Pentru implementări dedicate și condiții comerciale separate.",
            steps: [
              "Stabilim scopul, volumul și cerințele speciale.",
              "Confirmăm termenii comerciali și responsabilitățile.",
              "Pregătim onboardingul dedicat și regulile operaționale.",
              "Lansăm controlat după testare și aprobare finală.",
            ],
          },
        ],
      }
    : {
        eyebrow: "Client steps",
        title: "What happens after choosing a plan",
        description: "The process is guided. The client confirms the essential information while Autopilot One prepares the AI agent, knowledge base and widget installation.",
        plans: [
          {
            title: "Pilot",
            description: "For initial validation before a paid plan.",
            steps: [
              "Confirm the website and contact details.",
              "Answer a few business questions.",
              "Approve the AI profile generated for testing.",
              "Test one conversation and decide whether to move to Starter.",
            ],
          },
          {
            title: "Starter",
            description: "For the first real AI flow on the website.",
            steps: [
              "Confirm the company, domain and responsible contact.",
              "Add services, FAQ and main rules.",
              "Approve the knowledge base created by AI.",
              "Install the widget or send instructions to the developer.",
              "Send a test message and approve go-live.",
            ],
          },
          {
            title: "Pro",
            description: "For volume, inbox, analytics and organized follow-up.",
            steps: [
              "Confirm the team, roles and follow-up workflow.",
              "Add extended sources and human handoff rules.",
              "Test lead capture, inbox, notifications and analytics.",
              "Approve launch and receive an optimization report.",
            ],
          },
          {
            title: "Business",
            description: "For dedicated implementations and separately agreed commercial terms.",
            steps: [
              "Define scope, volume and special requirements.",
              "Confirm commercial terms and responsibilities.",
              "Prepare dedicated onboarding and operating rules.",
              "Launch in a controlled way after testing and final approval.",
            ],
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

      <section className="card">
        <div className="eyebrow">{planStepsCopy.eyebrow}</div>
        <h2>{planStepsCopy.title}</h2>
        <p>{planStepsCopy.description}</p>
      </section>

      <section className="grid three-columns" aria-label={planStepsCopy.title}>
        {planStepsCopy.plans.map((plan) => (
          <article className="card" key={plan.title}>
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <ol className="check-list">
              {plan.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
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
