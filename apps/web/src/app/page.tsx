import Link from "next/link";
import { Footer } from "../components/Footer";
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
  ["1", "Conectezi site-ul", "Adaugi widgetul Autopilot One pe website și stabilești ce domenii au voie să îl folosească."],
  ["2", "Încarci baza de cunoștințe", "Adaugi servicii, prețuri, reguli, întrebări frecvente și proceduri interne."],
  ["3", "AI-ul răspunde și califică", "Recepție AI răspunde 24/7, colectează date de contact și trimite cazurile importante către echipă."],
];

const results = [
  "Timp de răspuns mai mic pentru vizitatori",
  "Mai multe lead-uri captate din traficul existent",
  "Mai puține întrebări repetitive pentru echipă",
  "Conversații și evenimente urmărite într-un singur dashboard",
];

const metrics = [
  ["24/7", "răspunsuri pentru vizitatori"],
  ["CRM", "cereri demo și follow-up"],
  ["Widget", "instalare pe website"],
  ["AI", "bază de cunoștințe controlată"],
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="container">
        <section className="hero hero-split">
          <div>
            <div className="eyebrow">Angajați AI pentru IMM-uri</div>
            <h1>Transformă vizitatorii site-ului în lead-uri urmărite.</h1>
            <p>
              Autopilot One adaugă pe site-ul tău un angajat AI care răspunde la întrebări, colectează date de contact,
              trimite conversațiile importante în inbox și îți arată rezultatele într-un dashboard simplu.
            </p>
            <div className="actions">
              <Link href="/demo" className="button">Cere demo</Link>
              <Link href="/pricing" className="button secondary">Vezi prețurile</Link>
            </div>
            <div className="launch-kicker">
              <span>Fără instalare complicată</span>
              <span>Pilot ghidat</span>
              <span>Date urmărite în CRM Lite</span>
            </div>
          </div>
          <article className="card hero-card launch-panel">
            <span className="status-pill">Pilot disponibil</span>
            <h3>Recepție AI pentru website</h3>
            <p>Răspunde vizitatorilor, explică serviciile, cere datele de contact și pregătește următorul pas pentru echipă.</p>
            <div className="launch-panel-row">
              <strong>01</strong>
              <p>Vizitatorul întreabă despre servicii, program, prețuri sau disponibilitate.</p>
            </div>
            <div className="launch-panel-row">
              <strong>02</strong>
              <p>AI-ul răspunde folosind baza ta de cunoștințe și cere datele potrivite.</p>
            </div>
            <div className="launch-panel-row">
              <strong>03</strong>
              <p>Lead-ul ajunge în CRM, unde îl marchezi contactat, calificat sau închis.</p>
            </div>
          </article>
        </section>

        <section className="launch-strip">
          {metrics.map(([value, label]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        <section className="card section-heading">
          <div className="eyebrow">Pentru cine este</div>
          <h2>Practic pentru afaceri care primesc cereri repetitive.</h2>
          <p>Este potrivit pentru companii care primesc întrebări prin site, pierd lead-uri după program sau vor să vadă clar ce conversații merită urmărite.</p>
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
            <div className="actions">
              <Link href="/demo" className="button">Discută un pilot</Link>
            </div>
          </article>
          <article className="card">
            <div className="eyebrow">Centru de comandă</div>
            <h2>Lead-urile nu mai rămân pierdute în mesaje.</h2>
            <p>
              Cererile demo, conversațiile, evenimentele widgetului și follow-up-urile ajung într-un flux intern clar.
              Dashboardul arată ce s-a întâmplat și ce merită urmărit.
            </p>
            <div className="actions">
              <Link href="/demo" className="button secondary">Vezi cum ar funcționa la tine</Link>
            </div>
          </article>
        </section>

        <section className="card cta-card">
          <div>
            <div className="eyebrow">Pregătit pentru pilot</div>
            <h2>Începem cu un caz simplu și măsurabil.</h2>
            <p>Spune-ne ce tip de afacere ai, iar noi îți propunem primul flux AI: întrebări frecvente, captare lead-uri și urmărire în CRM.</p>
          </div>
          <Link href="/demo" className="button">Cere demo</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
