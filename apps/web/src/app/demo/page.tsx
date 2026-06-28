import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { DemoRequestForm } from "./DemoRequestForm";

const outcomes = [
  "Aflăm ce întrebări repetitive primește afacerea ta și unde se pierd lead-uri.",
  "Stabilim ce informații trebuie puse în baza de cunoștințe pentru răspunsuri corecte.",
  "Îți propunem un pilot simplu: widget, răspunsuri, lead capture, CRM și dashboard.",
];

const trustItems = [
  ["Răspuns rapid", "Cererea ajunge în CRM și poate fi urmărită cu status, notă internă și follow-up."],
  ["Fără obligație", "Demo-ul este o discuție de validare. Nu ai nevoie de card pentru a cere o discuție."],
  ["Date controlate", "Răspunsurile AI se bazează pe conținutul configurat pentru afacerea ta."],
];

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack">
        <section className="grid two-columns">
          <article className="card hero-card">
            <div className="eyebrow">Cerere demo</div>
            <h1>Vezi cum ar funcționa Autopilot One pe site-ul tău.</h1>
            <p>
              Completează formularul și pregătim o discuție scurtă despre primul flux AI potrivit: recepție web,
              captare lead-uri, întrebări frecvente și urmărire în CRM.
            </p>
            <ul className="check-list">
              {outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
            </ul>
            <div className="demo-trust">
              {trustItems.map(([title, description]) => (
                <article key={title}>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <p className="helper-text">
              Prin trimiterea formularului confirmi că ai citit politica de confidențialitate.
              <br />
              <Link href="/privacy">Vezi politica de confidențialitate</Link>
            </p>
          </article>

          <DemoRequestForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
