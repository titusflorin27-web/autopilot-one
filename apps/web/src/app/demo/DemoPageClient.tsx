"use client";

import Link from "next/link";
import { useAppLanguage } from "../../lib/useAppLanguage";
import { DemoRequestForm } from "./DemoRequestForm";

const demoPageCopy = {
  ro: {
    eyebrow: "Cerere demo",
    titlePrefix: "Vezi Autopilot One",
    titleSuffix: " pe cazul tău real.",
    body: "Completează formularul și pregătim o discuție scurtă despre primul flux AI potrivit pentru afacerea ta: recepție web, captare lead-uri, întrebări frecvente sau follow-up.",
    outcomes: [
      "Identificăm întrebările repetitive și locurile unde se pierd lead-uri.",
      "Stabilim baza de cunoștințe: servicii, reguli, prețuri, program și răspunsuri permise.",
      "Propunem un plan clar: widget AI, captare lead-uri, CRM Lite și dashboard de urmărire.",
    ],
    trustItems: [
      ["Răspuns rapid", "Cererea ajunge în CRM și poate fi urmărită cu status, notă internă și follow-up."],
      ["Fără obligație", "Demo-ul este o discuție de validare. Nu ai nevoie de card pentru a vedea dacă soluția se potrivește."],
      ["Date controlate", "Răspunsurile AI se bazează pe conținutul configurat pentru afacerea ta."],
    ],
    privacyPrefix: "Prin trimiterea formularului confirmi că ai citit politica de confidențialitate.",
    privacyLink: "Vezi politica de confidențialitate",
  },
  en: {
    eyebrow: "Demo request",
    titlePrefix: "See Autopilot One",
    titleSuffix: " on your real use case.",
    body: "Complete the form and we will prepare a short discussion about the first AI flow that fits your business: web reception, lead capture, FAQs or follow-up.",
    outcomes: [
      "We identify repetitive questions and the points where leads are lost.",
      "We define the knowledge base: services, rules, prices, opening hours and approved answers.",
      "We suggest a clear plan: AI widget, lead capture, CRM Lite and tracking dashboard.",
    ],
    trustItems: [
      ["Fast response", "The request lands in the CRM and can be tracked with status, internal note and follow-up."],
      ["No obligation", "The demo is a validation discussion. You do not need a card to see whether the solution fits."],
      ["Controlled data", "AI answers are based on the content configured for your business."],
    ],
    privacyPrefix: "By submitting the form you confirm that you have read the privacy policy.",
    privacyLink: "View the privacy policy",
  },
} as const;

export function DemoPageClient() {
  const copy = demoPageCopy[useAppLanguage()];

  return (
    <main className="container page-stack">
      <section className="grid two-columns demo-layout">
        <article className="card hero-card">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h1>
            <span className="gradient-text">{copy.titlePrefix}</span>{copy.titleSuffix}
          </h1>
          <p className="lead-text">{copy.body}</p>
          <ul className="check-list">
            {copy.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
          <div className="demo-trust">
            {copy.trustItems.map(([title, description]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className="helper-text">
            {copy.privacyPrefix}
            <br />
            <Link href="/privacy">{copy.privacyLink}</Link>
          </p>
        </article>

        <DemoRequestForm />
      </section>
    </main>
  );
}
