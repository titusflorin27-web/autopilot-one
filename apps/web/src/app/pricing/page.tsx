import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";

const plans = [
  {
    name: "Starter",
    price: "49 €",
    note: "pentru validare și pilot mic",
    features: ["1 widget activ", "Bază de cunoștințe de început", "Lead capture simplu", "CRM Lite pentru cereri demo", "Suport pentru configurare inițială"],
  },
  {
    name: "Growth",
    price: "99 €",
    note: "pentru afaceri active",
    featured: true,
    features: ["Widget pentru site activ", "Mai multe surse de cunoștințe", "Conversații și escaladări", "Analiză widget și lead-uri", "Dashboard cu metrici reale"],
  },
  {
    name: "Pro",
    price: "199 €",
    note: "pentru echipe care vor automatizare serioasă",
    features: ["Fluxuri operaționale extinse", "Prioritizare lead-uri", "Rapoarte și task-uri", "Follow-up-uri în CRM", "Suport prioritar pentru pilot"],
  },
  {
    name: "Custom",
    price: "Cere ofertă",
    note: "pentru integrări, volum mare sau setup dedicat",
    features: ["Configurare dedicată", "Integrări custom", "Volum și SLA discutate separat", "Onboarding ghidat", "Ofertă adaptată procesului tău"],
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack">
        <section className="card hero-card">
          <div className="eyebrow">Prețuri</div>
          <h1>Planuri simple pentru primul angajat AI.</h1>
          <p>
            Începe cu un pilot potrivit pentru volumul actual, validează valoarea și extinde automatizările după ce vezi lead-uri și conversații reale în dashboard.
          </p>
          <div className="actions">
            <Link href="/demo" className="button">Cere demo</Link>
            <Link href="/terms" className="button secondary">Vezi termenii</Link>
          </div>
          <div className="launch-kicker">
            <span>Demo fără card</span>
            <span>Setup ghidat</span>
            <span>Planul final se confirmă în ofertă</span>
          </div>
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
              <div className="actions">
                <Link href="/demo" className="button secondary">Discută planul</Link>
              </div>
            </article>
          ))}
        </section>

        <section className="card cta-card">
          <div>
            <h2>Nu știi ce plan ți se potrivește?</h2>
            <p>Trimite o cerere demo și stabilim împreună dacă primul caz de utilizare ar trebui să fie recepția AI, captarea lead-urilor sau urmărirea conversațiilor.</p>
          </div>
          <Link href="/demo" className="button">Cere recomandare</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
