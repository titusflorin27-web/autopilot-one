import Link from "next/link";
import { Nav } from "../components/Nav";

const audiences = [
  "Clinici și cabinete private",
  "Saloane și servicii locale",
  "Service-uri auto",
  "Consultanți și agenții",
  "Firme B2B cu cereri recurente",
  "Echipe mici care pierd lead-uri după program",
];

const steps = [
  ["1", "Conectezi site-ul", "Adaugi widgetul Autopilot One pe website și stabilești ce domenii au voie să-l folosească."],
  ["2", "Încarci baza de cunoștințe", "Adaugi servicii, prețuri, reguli, întrebări frecvente și proceduri interne."],
  ["3", "AI-ul răspunde și califică", "Reception AI răspunde 24/7, colectează date de contact și escaladează cazurile importante."],
];

const results = [
  "Timp de răspuns mai mic pentru vizitatori",
  "Mai multe lead-uri captate din traficul existent",
  "Mai puține întrebări repetitive pentru echipă",
  "Conversații și evenimente urmărite într-un singur dashboard",
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="container">
        <section className="hero hero-split">
          <div>
            <div className="eyebrow">Angajați AI pentru IMM-uri</div>
            <h1>Angajați AI care răspund, califică și urmăresc clienții 24/7.</h1>
            <p>
              Autopilot One ajută afacerile mici și medii să transforme vizitatorii de pe website în conversații,
              lead-uri și sarcini clare pentru echipă, fără să angajeze personal suplimentar pentru întrebări repetitive.
            </p>
            <div className="actions">
              <Link href="/register" className="button">Începe pilotul</Link>
              <Link href="/pricing" className="button secondary">Vezi pricing</Link>
            </div>
          </div>
          <article className="card hero-card">
            <span className="status-pill">Pilot privat activ</span>
            <h3>Reception AI</h3>
            <p>Răspunde vizitatorilor, explică serviciile, cere datele de contact și trimite conversațiile importante către echipă.</p>
            <div className="mini-metrics">
              <strong>24/7</strong>
              <span>răspunsuri automate</span>
            </div>
          </article>
        </section>

        <section className="card">
          <div className="eyebrow">Pentru cine este</div>
          <h2>Practic pentru afaceri care primesc cereri repetitive.</h2>
          <div className="badge-list">
            {audiences.map((audience) => <span key={audience}>{audience}</span>)}
          </div>
        </section>

        <section className="grid three-columns">
          {steps.map(([number, title, description]) => (
            <article className="card" key={title}>
              <div className="step-number">{number}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="grid two-columns">
          <article className="card">
            <div className="eyebrow">Rezultate urmărite</div>
            <h2>Mai rapid, mai clar, mai măsurabil.</h2>
            <ul className="check-list">
              {results.map((result) => <li key={result}>{result}</li>)}
            </ul>
          </article>
          <article className="card">
            <div className="eyebrow">Centru de comandă</div>
            <h2>Totul devine eveniment.</h2>
            <p>
              Mesajele clienților, lead-urile, escaladările, sarcinile și setările widgetului ajung într-un dashboard
              operațional. Astfel poți vedea ce s-a întâmplat, ce trebuie urmărit și unde se pierd oportunități.
            </p>
            <div className="actions">
              <Link href="/dashboard" className="button secondary">Vezi dashboard</Link>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
