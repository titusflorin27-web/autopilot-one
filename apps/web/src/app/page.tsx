import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../components/Footer";
import { Nav } from "../components/Nav";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Autopilot One — angajați AI pentru IMM-uri",
  description:
    "Adaugă pe website un angajat AI care răspunde vizitatorilor, captează lead-uri și trimite conversațiile importante în CRM Lite.",
  path: "/",
});

const metrics = [
  ["24/7", "recepție AI pentru vizitatori"],
  ["CRM", "lead-uri urmărite până la follow-up"],
  ["Widget", "instalare rapidă pe website"],
  ["AI", "răspunsuri din baza ta de cunoștințe"],
];

const features = [
  ["AI", "Recepție web inteligentă", "Răspunde la întrebări, explică serviciile și cere datele potrivite fără să pară un formular rigid."],
  ["CRM", "Lead-uri organizate", "Cererile ajung într-un flux clar, cu status, notă internă, următorul pas și follow-up."],
  ["QA", "Control înainte de lansare", "Configurezi baza de cunoștințe, domeniile permise și regulile de răspuns înainte de trafic real."],
];

const audiences = [
  "Clinici și cabinete private",
  "Saloane și servicii locale",
  "Service-uri auto",
  "Consultanți și agenții",
  "Firme B2B cu cereri recurente",
  "Echipe mici care pierd lead-uri după program",
];

const steps = [
  ["01", "Setăm primul caz", "Alegem ce trebuie să facă AI-ul: recepție, întrebări frecvente, captare lead-uri sau calificare cereri."],
  ["02", "Încărcăm informația", "Adăugăm servicii, reguli, prețuri, program, întrebări frecvente și instrucțiuni pentru răspunsuri controlate."],
  ["03", "Pornim pilotul", "Instalăm widgetul, urmărim conversațiile și optimizăm ce se întâmplă după fiecare cerere."],
];

const trustItems = [
  ["Fără token expus", "Snippetul widgetului ascunde datele sensibile în interfață."],
  ["Backup validat", "Backup local și off-server confirmat pentru pilot."],
  ["Security hardening", "Firewall, fail2ban, rate limits și headers de securitate."],
  ["Final QA", "Homepage, API, SEO, backup și monitoring validate pe VPS."],
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="container">
        <section className="hero hero-split">
          <div>
            <div className="eyebrow">AI receptionist + CRM Lite</div>
            <h1><span className="gradient-text">Un angajat AI</span> care nu lasă lead-urile să se piardă.</h1>
            <p className="lead-text">
              Autopilot One transformă website-ul într-un canal activ de vânzare: răspunde vizitatorilor, colectează datele importante și trimite conversațiile în CRM pentru follow-up.
            </p>
            <div className="actions">
              <Link href="/demo" className="button">Cere demo</Link>
              <Link href="/pricing" className="button secondary">Vezi planurile</Link>
            </div>
            <div className="launch-kicker">
              <span>Demo fără card</span>
              <span>Pilot ghidat</span>
              <span>Widget pentru website</span>
              <span>CRM Lite inclus</span>
            </div>
          </div>

          <article className="card hero-card launch-panel">
            <span className="status-pill">Pilot live</span>
            <h2>Recepție AI pentru website</h2>
            <p>Experiență modernă pentru vizitatori și control operațional pentru echipă.</p>
            <div className="launch-panel-row">
              <strong>01</strong>
              <p>Vizitatorul întreabă despre servicii, program, disponibilitate sau ofertă.</p>
            </div>
            <div className="launch-panel-row">
              <strong>02</strong>
              <p>AI-ul răspunde din baza ta de cunoștințe și cere datele potrivite.</p>
            </div>
            <div className="launch-panel-row">
              <strong>03</strong>
              <p>Lead-ul ajunge în CRM, cu status și următorul pas pentru echipă.</p>
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
          <div className="eyebrow">De ce contează</div>
          <h2>Un website frumos nu ajunge dacă lead-urile nu sunt urmărite.</h2>
          <p>
            Autopilot One pune AI-ul la lucru în punctul cel mai important: conversația cu vizitatorul. Nu înlocuiește echipa, ci îi pregătește cererile bune și le face mai ușor de urmărit.
          </p>
        </section>

        <section className="grid three-columns">
          {features.map(([icon, title, description]) => (
            <article className="card feature-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="card story-card">
          <div>
            <div className="eyebrow">Pentru cine este</div>
            <h2>Creat pentru afaceri care primesc cereri repetitive.</h2>
            <p>
              Ideal când clienții întreabă aceleași lucruri, echipa răspunde greu după program sau cererile ajung împrăștiate în e-mailuri, telefoane și mesaje.
            </p>
            <div className="badge-list">
              {audiences.map((audience) => <span key={audience}>{audience}</span>)}
            </div>
          </div>
          <div className="story-panel">
            <article>
              <strong>Mai rapid</strong>
              <p>Vizitatorul primește răspuns imediat, nu așteaptă până a doua zi.</p>
            </article>
            <article>
              <strong>Mai clar</strong>
              <p>Echipa vede cererile într-un dashboard, nu doar în notificări separate.</p>
            </article>
            <article>
              <strong>Mai măsurabil</strong>
              <p>Urmărești conversații, lead-uri, statusuri și activitate widget.</p>
            </article>
          </div>
        </section>

        <section className="section-heading">
          <div className="eyebrow">Cum pornim</div>
          <h2>Un pilot simplu, apoi extindem ce funcționează.</h2>
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

        <section className="trust-band">
          {trustItems.map(([title, description]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="card cta-card">
          <div>
            <div className="eyebrow">Pregătit pentru pilot</div>
            <h2>Hai să alegem primul flux AI pentru afacerea ta.</h2>
            <p>Spune-ne ce tip de companie ai și ce conversații vrei să automatizezi prima dată. Îți propunem o implementare clară, măsurabilă și ușor de testat.</p>
          </div>
          <Link href="/demo" className="button">Cere demo</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
