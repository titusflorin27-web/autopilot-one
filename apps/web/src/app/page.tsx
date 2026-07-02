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
  ["< 1 min", "lead pregătit pentru follow-up"],
  ["CRM", "status, notă internă, next step"],
  ["Pilot", "lansare controlată pe website"],
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
  ["Securitate întărită", "Firewall, fail2ban, rate limits și headers de securitate."],
  ["QA final", "Homepage, API, SEO, backup și monitoring validate pe VPS."],
];

const beforeAfter = [
  ["Înainte", "Lead-uri pierdute în inbox, răspunsuri întârziate și întrebări repetitive care consumă timpul echipei."],
  ["După", "AI-ul răspunde imediat, cere datele importante și trimite conversația într-un CRM simplu de urmărit."],
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="container">
        <section className="hero hero-split premium-hero">
          <div>
            <div className="eyebrow">Recepționer AI + CRM Lite</div>
            <h1><span className="gradient-text">Un angajat AI</span> care transformă vizitatorii în lead-uri urmărite.</h1>
            <p className="lead-text">
              Autopilot One transformă website-ul într-un canal activ de vânzare: răspunde vizitatorilor, colectează datele importante și trimite conversațiile în CRM pentru follow-up.
            </p>
            <div className="actions">
              <Link href="/register" className="button">Creează cont</Link>
              <Link href="/demo" className="button secondary">Cere demo</Link>
              <Link href="/pricing" className="button secondary">Vezi planurile</Link>
            </div>
            <div className="launch-kicker">
              <span>Cont creat în câteva minute</span>
              <span>Demo fără card</span>
              <span>Pilot ghidat</span>
              <span>CRM Lite inclus</span>
            </div>
          </div>

          <aside className="product-showcase" aria-label="Previzualizare Autopilot One">
            <div className="showcase-topbar">
              <div className="console-dots"><span /><span /><span /></div>
              <span>PILOT LIVE</span>
            </div>
            <div className="showcase-grid">
              <section className="ai-window">
                <div className="ai-window-header">
                  <div>
                    <strong>Recepționer AI</strong>
                    <span>Conversație website</span>
                  </div>
                  <em>online</em>
                </div>
                <div className="chat-bubble visitor">Bună, vreau o programare și câteva detalii despre servicii.</div>
                <div className="chat-bubble ai">Sigur. Îți pot explica serviciile și pot trimite cererea către echipă. Pentru ce zi ai prefera programarea?</div>
                <div className="chat-bubble visitor compact">Mâine după ora 15:00.</div>
              </section>

              <section className="crm-window">
                <div className="crm-card active">
                  <span>Lead nou</span>
                  <strong>Programare cerută</strong>
                  <p>Status: calificat</p>
                </div>
                <div className="crm-card">
                  <span>Pas următor</span>
                  <strong>Sună clientul</strong>
                  <p>Follow-up: azi</p>
                </div>
              </section>
            </div>
            <div className="showcase-footer">
              <span>Captare leaduri</span>
              <span>CRM Lite</span>
              <span>Analitice</span>
            </div>
          </aside>
        </section>

        <section className="launch-strip premium-strip">
          {metrics.map(([value, label]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        <section className="card section-heading statement-card">
          <div className="eyebrow">De ce contează</div>
          <h2>Un website frumos nu ajunge dacă lead-urile nu sunt urmărite.</h2>
          <p>
            Autopilot One pune AI-ul la lucru în punctul cel mai important: conversația cu vizitatorul. Nu înlocuiește echipa, ci îi pregătește cererile bune și le face mai ușor de urmărit.
          </p>
        </section>

        <section className="grid three-columns">
          {features.map(([icon, title, description]) => (
            <article className="card feature-card elevated-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="before-after-grid">
          {beforeAfter.map(([title, description]) => (
            <article className="card before-after-card" key={title}>
              <div className="eyebrow">{title}</div>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="card dashboard-preview">
          <div>
            <div className="eyebrow">Previzualizare dashboard</div>
            <h2>Tot ce contează ajunge într-un flux clar.</h2>
            <p>Conversații, lead-uri, statusuri, activitate widget și follow-up-uri într-un singur loc, fără să pierzi contextul comercial.</p>
          </div>
          <div className="dashboard-board">
            <article>
              <span>Conversații</span>
              <strong>38</strong>
              <p>ultimele 7 zile</p>
            </article>
            <article>
              <span>Lead-uri</span>
              <strong>12</strong>
              <p>pregătite pentru contact</p>
            </article>
            <article>
              <span>Follow-up</span>
              <strong>5</strong>
              <p>acțiuni deschise</p>
            </article>
          </div>
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

        <section className="trust-band premium-trust">
          {trustItems.map(([title, description]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="card cta-card final-cta-card">
          <div>
            <div className="eyebrow">Pregătit pentru pilot</div>
            <h2>Pornește din pagina principală și creează primul workspace.</h2>
            <p>Un vizitator poate crea cont, poate intra în dashboard și poate începe configurarea primului flux AI pentru compania sa.</p>
          </div>
          <Link href="/register" className="button">Creează cont</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
