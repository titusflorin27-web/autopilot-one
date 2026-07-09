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
  const planDetailsCopy = language === "ro"
    ? {
        eyebrow: "Explicația planurilor",
        title: "Ce reprezintă fiecare element din plan",
        description: "Fiecare limită și funcție are un rol clar. Mai jos vezi ce înseamnă fiecare parte din plan, pe înțelesul clientului.",
        plans: [
          {
            title: "Pilot — validare inițială",
            items: [
              "0 € / validare: test controlat pentru a vedea dacă agentul AI se potrivește businessului tău; nu este plan gratuit permanent pentru producție.",
              "100 mesaje widget / lună: limită pentru conversațiile de test dintre vizitatori și widget.",
              "5 surse de cunoștințe: câteva pagini, documente sau intrări KB folosite de AI ca informație verificată.",
              "1 membru echipă: o persoană responsabilă testează răspunsurile și primește leadurile.",
              "Flux de bază pentru recepționerul AI: AI răspunde la întrebări simple și colectează date de contact.",
              "Validare fără card: poți testa procesul înainte de o activare comercială plătită.",
            ],
          },
          {
            title: "Starter — primul flux real",
            items: [
              "49 € / lună: plan plătit pentru primul agent AI activ pe website.",
              "1.000 mesaje widget / lună: volum suficient pentru o firmă mică la început de utilizare reală.",
              "50 surse de cunoștințe: pagini, FAQ-uri, documente sau intrări KB care explică serviciile și regulile firmei.",
              "3 membri echipă: ownerul și până la două persoane pot urmări conversații, leaduri și follow-up.",
              "Widget pe website și captare leaduri: vizitatorii pot discuta cu AI-ul, iar datele utile ajung în dashboard.",
              "Setup ghidat pentru lansare: Autopilot One te ajută să pregătești profilul, sursele, widgetul și testul final.",
            ],
          },
          {
            title: "Pro — volum și follow-up",
            items: [
              "99 € / lună: plan pentru echipe care au conversații mai multe și nevoie de control operațional.",
              "10.000 mesaje widget / lună: volum mai mare pentru site-uri active sau campanii cu trafic.",
              "500 surse de cunoștințe: bază extinsă pentru servicii, reguli, obiecții, proceduri și întrebări frecvente.",
              "10 membri echipă: mai multe persoane pot lucra în inbox, analytics și follow-up.",
              "Inbox, analytics și transfer uman: AI răspunde, dar conversațiile importante pot fi preluate de operator.",
              "Dashboard operațional: vezi conversații, leaduri, notificări, activitate și recomandări de optimizare.",
            ],
          },
          {
            title: "Business — implementare dedicată",
            items: [
              "Preț personalizat: se stabilește după volum, complexitate, suport și cerințe speciale.",
              "50.000 mesaje widget / lună: limită orientativă pentru operațiuni cu trafic mare.",
              "2.000 surse de cunoștințe: bază extinsă pentru documentație, procese, produse, reguli și scenarii complexe.",
              "50 membri echipă: potrivit pentru echipe mai mari sau mai multe departamente.",
              "Onboarding și flux operațional personalizat: configurarea se face pe procesul real al clientului.",
              "Condiții comerciale separate: termenii, suportul, responsabilitățile și activarea se confirmă contractual.",
            ],
          },
        ],
      }
    : {
        eyebrow: "Plan explanation",
        title: "What each part of the plan means",
        description: "Every limit and feature has a clear role. Below you can see what each part means in practical client terms.",
        plans: [
          {
            title: "Pilot — initial validation",
            items: [
              "0 € / validation: controlled test to see whether the AI agent fits the business; not a permanent free production plan.",
              "100 widget messages / month: limit for test conversations between visitors and the widget.",
              "5 knowledge sources: a few pages, documents or KB entries used by AI as verified information.",
              "1 team member: one responsible person tests responses and receives leads.",
              "Basic AI receptionist flow: AI answers simple questions and collects contact details.",
              "No-card validation: test the process before paid commercial activation.",
            ],
          },
          {
            title: "Starter — first real flow",
            items: [
              "49 € / month: paid plan for the first active AI agent on the website.",
              "1,000 widget messages / month: enough volume for a small business starting real usage.",
              "50 knowledge sources: pages, FAQs, documents or KB entries that explain services and company rules.",
              "3 team members: the owner and up to two people can track conversations, leads and follow-up.",
              "Website widget and lead capture: visitors can talk to AI, and useful data reaches the dashboard.",
              "Guided setup for launch: Autopilot One helps prepare the profile, sources, widget and final test.",
            ],
          },
          {
            title: "Pro — volume and follow-up",
            items: [
              "99 € / month: plan for teams with more conversations and operational control needs.",
              "10,000 widget messages / month: higher volume for active sites or traffic campaigns.",
              "500 knowledge sources: extended base for services, rules, objections, procedures and FAQs.",
              "10 team members: more people can work in inbox, analytics and follow-up.",
              "Inbox, analytics and human handoff: AI replies, but important conversations can be taken over by an operator.",
              "Operational dashboard: see conversations, leads, notifications, activity and optimization recommendations.",
            ],
          },
          {
            title: "Business — dedicated implementation",
            items: [
              "Custom price: agreed based on volume, complexity, support and special requirements.",
              "50,000 widget messages / month: indicative limit for higher-traffic operations.",
              "2,000 knowledge sources: extended base for documentation, processes, products, rules and complex scenarios.",
              "50 team members: suitable for larger teams or multiple departments.",
              "Custom onboarding and operating model: configuration follows the client's real process.",
              "Separate commercial terms: terms, support, responsibilities and activation are contractually confirmed.",
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
        <div className="eyebrow">{planDetailsCopy.eyebrow}</div>
        <h2>{planDetailsCopy.title}</h2>
        <p>{planDetailsCopy.description}</p>
      </section>

      <section className="grid three-columns" aria-label={planDetailsCopy.title}>
        {planDetailsCopy.plans.map((plan) => (
          <article className="card" key={plan.title}>
            <h3>{plan.title}</h3>
            <ul className="check-list">
              {plan.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
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
