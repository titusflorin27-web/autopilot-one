"use client";

import Link from "next/link";
import { useAppLanguage } from "../../lib/useAppLanguage";

const trustCopy = {
  ro: {
    eyebrow: "Încredere și control",
    title: "AI util pentru business, lansat controlat și ușor de verificat.",
    body: "Autopilot One este construit pentru companii care vor răspuns rapid, lead-uri organizate și control operațional înainte de scalare.",
    primaryCta: "Cere demo",
    secondaryCta: "Vezi planurile",
    sections: [
      {
        title: "Ce face AI-ul",
        items: [
          "răspunde la întrebări pe baza informațiilor configurate în baza de cunoștințe;",
          "colectează detalii utile pentru lead-uri și follow-up;",
          "trimite conversațiile într-un flux de lucru unde echipa poate urmări statusul.",
        ],
      },
      {
        title: "Ce nu promitem",
        items: [
          "nu promitem răspunsuri perfecte în orice situație;",
          "nu înlocuim verificarea umană pentru informații sensibile;",
          "nu activăm un flux live fără configurare și testare.",
        ],
      },
      {
        title: "Cum reducem riscul",
        items: [
          "pornim cu un demo și un caz de utilizare clar;",
          "configurăm sursele de cunoștințe și domeniile permise;",
          "urmărim conversații, lead-uri și acțiuni de follow-up în dashboard.",
        ],
      },
      {
        title: "Plăți și activare",
        items: [
          "planurile plătite sunt pregătite pentru activare comercială;",
          "în etapa curentă validăm planul prin demo înainte de plata online;",
          "activarea finală depinde de datele firmei și documentele comerciale finale.",
        ],
      },
    ],
    processTitle: "Proces de lansare recomandat",
    process: [
      ["01", "Demo", "Înțelegem afacerea și alegem primul flux AI."],
      ["02", "Configurare", "Adăugăm informații, reguli și limite de răspuns."],
      ["03", "Testare", "Verificăm conversații, lead-uri, inbox și follow-up."],
      ["04", "Activare", "Pornim controlat după ce setupul este clar și validat."],
    ],
  },
  en: {
    eyebrow: "Trust and control",
    title: "Useful business AI, launched in a controlled and verifiable way.",
    body: "Autopilot One is built for companies that need faster replies, organized leads and operational control before scaling.",
    primaryCta: "Request demo",
    secondaryCta: "View plans",
    sections: [
      {
        title: "What the AI does",
        items: [
          "answers questions using the configured knowledge base;",
          "collects useful details for leads and follow-up;",
          "sends conversations into a workflow where the team can track status.",
        ],
      },
      {
        title: "What we do not promise",
        items: [
          "we do not promise perfect replies in every situation;",
          "we do not replace human review for sensitive information;",
          "we do not activate a live flow without setup and testing.",
        ],
      },
      {
        title: "How we reduce risk",
        items: [
          "we start with a demo and a clear use case;",
          "we configure knowledge sources and allowed domains;",
          "we track conversations, leads and follow-up actions from the dashboard.",
        ],
      },
      {
        title: "Payments and activation",
        items: [
          "paid plans are prepared for commercial activation;",
          "at this stage we validate the plan through demo before online payment;",
          "final activation depends on company details and final commercial documents.",
        ],
      },
    ],
    processTitle: "Recommended launch process",
    process: [
      ["01", "Demo", "We understand the business and choose the first AI flow."],
      ["02", "Setup", "We add information, rules and reply limits."],
      ["03", "Testing", "We check conversations, leads, inbox and follow-up."],
      ["04", "Activation", "We launch in a controlled way after setup is clear and validated."],
    ],
  },
} as const;

export function TrustPageClient() {
  const copy = trustCopy[useAppLanguage()];

  return (
    <main className="container page-stack">
      <section className="card hero-card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p className="lead-text">{copy.body}</p>
        <div className="actions">
          <Link href="/demo" className="button">{copy.primaryCta}</Link>
          <Link href="/pricing" className="button secondary">{copy.secondaryCta}</Link>
        </div>
      </section>

      <section className="grid two-columns">
        {copy.sections.map((section) => (
          <article className="card" key={section.title}>
            <h2>{section.title}</h2>
            <ul className="check-list">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="section-heading">
        <div className="eyebrow">Autopilot One</div>
        <h2>{copy.processTitle}</h2>
      </section>

      <section className="grid four-columns">
        {copy.process.map(([number, title, description]) => (
          <article className="card" key={title}>
            <div className="step-number">{number}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
