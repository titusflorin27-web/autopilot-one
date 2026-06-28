import Link from "next/link";
import { Nav } from "../../components/Nav";
import { DemoRequestForm } from "./DemoRequestForm";

const outcomes = [
  "Identificăm ce AI employee are cel mai mare impact pentru afacerea ta.",
  "Stabilim ce conținut trebuie pus în baza de cunoștințe.",
  "Estimăm un pilot simplu: widget, răspunsuri, lead capture și urmărire în dashboard.",
];

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack">
        <section className="grid two-columns">
          <article className="card hero-card">
            <div className="eyebrow">Cerere demo</div>
            <h1>Vezi cum ar arăta primul tău angajat AI.</h1>
            <p>
              Completează formularul și folosim răspunsurile ca să pregătim o discuție scurtă despre pilotul potrivit pentru afacerea ta.
            </p>
            <ul className="check-list">
              {outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
            </ul>
            <p className="helper-text">
              Prin trimiterea formularului confirmi că ai citit politica de confidențialitate.
              <br />
              <Link href="/privacy">Vezi politica de confidențialitate</Link>
            </p>
          </article>

          <DemoRequestForm />
        </section>
      </main>
    </>
  );
}
