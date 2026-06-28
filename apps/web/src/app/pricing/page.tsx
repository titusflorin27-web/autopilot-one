import Link from "next/link";
import { Nav } from "../../components/Nav";

const plans = [
  {
    name: "Starter",
    price: "49 €",
    note: "pentru test/pilot mic",
    features: ["1 widget activ", "Bază de cunoștințe de început", "Lead capture simplu", "Suport pentru configurare inițială"],
  },
  {
    name: "Growth",
    price: "99 €",
    note: "pentru afaceri active",
    featured: true,
    features: ["Widget pentru site activ", "Mai multe surse de cunoștințe", "Conversații și escaladări", "Analiză widget și lead-uri"],
  },
  {
    name: "Pro",
    price: "199 €",
    note: "pentru echipe care vor automatizare serioasă",
    features: ["Fluxuri operaționale extinse", "Prioritizare lead-uri", "Rapoarte și task-uri", "Suport prioritar pentru pilot"],
  },
  {
    name: "Custom",
    price: "Cere ofertă",
    note: "pentru integrări, volum mare sau setup dedicat",
    features: ["Configurare dedicată", "Integrări custom", "Volum și SLA discutate separat", "Onboarding ghidat"],
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack">
        <section className="card hero-card">
          <div className="eyebrow">Pricing</div>
          <h1>Planuri simple pentru lansarea pilot.</h1>
          <p>
            Începe cu un plan potrivit pentru volumul actual, validează valoarea și extinde automatizările după ce vezi rezultate.
          </p>
        </section>

        <section className="pricing-grid">
          {plans.map((plan) => (
            <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured ? <span className="status-pill">Recomandat</span> : null}
              <h2>{plan.name}</h2>
              <div className="price">{plan.price}<span>{plan.price.includes("€") ? "/lună" : ""}</span></div>
              <p>{plan.note}</p>
              <ul className="check-list">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className="card">
          <h2>Notă pentru pilot</h2>
          <p>Prețurile pot fi ajustate înainte de lansarea comercială completă.</p>
          <p>
            Pentru companii cu fluxuri speciale, integrări sau volum mare, planul Custom se stabilește după o discuție scurtă despre obiective și datele disponibile.
          </p>
          <div className="actions">
            <Link href="/register" className="button">Începe pilotul</Link>
            <Link href="/terms" className="button secondary">Vezi termenii</Link>
          </div>
        </section>
      </main>
    </>
  );
}
