import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Prețuri Autopilot One",
  description:
    "Vezi planurile Autopilot One pentru widget AI, captare lead-uri, CRM Lite și automatizare ghidată pentru IMM-uri.",
  path: "/pricing",
});

const plans = [
  {
    name: "Starter",
    price: "49 €",
    note: "pentru validare și primul flux AI",
    features: ["1 widget activ", "Bază de cunoștințe de început", "Lead capture simplu", "CRM Lite pentru cereri demo", "Setup inițial ghidat"],
  },
  {
    name: "Growth",
    price: "99 €",
    note: "pentru afaceri care vor să urmărească lead-uri real",
    featured: true,
    features: ["Widget activ pe website", "Bază de cunoștințe extinsă", "Conversații și escaladări", "Widget analytics", "Dashboard cu metrici reale"],
  },
  {
    name: "Pro",
    price: "199 €",
    note: "pentru echipe care vor automatizare operațională",
    features: ["Fluxuri AI extinse", "Prioritizare lead-uri", "Rapoarte și task-uri", "Follow-up-uri în CRM", "Suport prioritar pentru pilot"],
  },
  {
    name: "Custom",
    price: "Cere ofertă",
    note: "pentru integrări, volum mare sau setup dedicat",
    features: ["Configurare dedicată", "Integrări custom", "Volum și SLA discutate separat", "Onboarding ghidat", "Ofertă adaptată procesului tău"],
  },
];

const principles = [
  ["Fără surprize", "Începem cu un caz clar și confirmăm planul final înainte de activare."],
  ["Pilot măsurabil", "Urmărim conversații, lead-uri, statusuri și pașii următori."],
  ["Scalare treptată", "Extindem doar după ce primul flux produce valoare."],
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack">
        <section className="card hero-card pricing-hero">
          <div className="eyebrow">Prețuri</div>
          <h1><span className="gradient-text">Planuri clare</span> pentru primul tău angajat AI.</h1>
          <p className="lead-text">
            Alege un punct de pornire, validează în pilot și extinde doar după ce vezi lead-uri, conversații și rezultate urmărite în dashboard.
          </p>
          <div className="actions">
            <Link href="/demo" className="button">Cere demo</Link>
            <Link href="/terms" className="button secondary">Vezi termenii</Link>
          </div>
          <div className="launch-kicker">
            <span>Demo fără card</span>
            <span>Setup ghidat</span>
            <span>Plan confirmat în ofertă</span>
          </div>
        </section>

        <section className="pricing-grid">
          {plans.map((plan) => (
            <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured ? <span className="status-pill">Recomandat</span> : null}
              <h2>{plan.name}</h2>
              <div className="price">{plan.price}<span>{plan.price.includes("€") ? "/lună" : ""}</span></div>
              <p className="plan-note">{plan.note}</p>
              <ul className="check-list">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className="actions">
                <Link href="/demo" className="button secondary">Discută planul</Link>
              </div>
            </article>
          ))}
        </section>

        <section className="grid three-columns">
          {principles.map(([title, description]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="card cta-card">
          <div>
            <div className="eyebrow">Nu știi ce plan ți se potrivește?</div>
            <h2>Începem cu ce aduce valoare cel mai repede.</h2>
            <p>Trimite o cerere demo și stabilim împreună dacă primul caz de utilizare ar trebui să fie recepția AI, captarea lead-urilor sau urmărirea conversațiilor.</p>
          </div>
          <Link href="/demo" className="button">Cere recomandare</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
