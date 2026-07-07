"use client";

import Link from "next/link";
import { useAppLanguage } from "../lib/useAppLanguage";

const homeCopy = {
  ro: {
    metrics: [
      ["24/7", "recepție AI pentru vizitatori"],
      ["< 1 min", "lead pregătit pentru follow-up"],
      ["CRM", "status, notă internă, next step"],
      ["Pilot", "lansare controlată pe website"],
    ],
    features: [
      ["AI", "Recepție web inteligentă", "Răspunde la întrebări, explică serviciile și cere datele potrivite fără să pară un formular rigid."],
      ["CRM", "Lead-uri organizate", "Cererile ajung într-un flux clar, cu status, notă internă, următorul pas și follow-up."],
      ["QA", "Control înainte de lansare", "Configurezi baza de cunoștințe, domeniile permise și regulile de răspuns înainte de trafic real."],
    ],
    audiences: [
      "Clinici și cabinete private",
      "Saloane și servicii locale",
      "Service-uri auto",
      "Consultanți și agenții",
      "Firme B2B cu cereri recurente",
      "Echipe mici care pierd lead-uri după program",
    ],
    steps: [
      ["01", "Discutăm cazul", "Începem cu o cerere demo și alegem primul flux: recepție, întrebări frecvente, captare lead-uri sau calificare cereri."],
      ["02", "Încărcăm informația", "Adăugăm servicii, reguli, prețuri, program, întrebări frecvente și instrucțiuni pentru răspunsuri controlate."],
      ["03", "Pornim implementarea", "Instalăm widgetul, urmărim conversațiile și optimizăm fiecare cerere până devine un flux clar."],
    ],
    trustItems: [
      ["Fără token expus", "Snippetul widgetului ascunde datele sensibile în interfață."],
      ["Backup validat", "Backup local și off-server pregătit pentru operare sigură."],
      ["Securitate întărită", "Firewall, fail2ban, rate limits și headers de securitate."],
      ["QA final", "Homepage, API, SEO, backup și monitoring validate pe VPS."],
    ],
    beforeAfter: [
      ["Înainte", "Lead-uri pierdute în inbox, răspunsuri întârziate și întrebări repetitive care consumă timpul echipei."],
      ["După", "AI-ul răspunde imediat, cere datele importante și trimite conversația într-un CRM simplu de urmărit."],
    ],
    heroEyebrow: "Recepționer AI + CRM Lite",
    heroTitlePrefix: "Un angajat AI",
    heroTitleSuffix: " care transformă vizitatorii în lead-uri urmărite.",
    heroDescription: "Autopilot One transformă website-ul într-un canal activ de vânzare: răspunde vizitatorilor, colectează datele importante și trimite conversațiile în CRM pentru follow-up.",
    createAccount: "Creează workspace",
    requestDemo: "Cere demo",
    viewPlans: "Vezi planurile",
    trustPage: "Vezi cum lucrăm sigur",
    kickers: ["Demo fără card", "Pilot ghidat", "Activare controlată", "CRM Lite inclus"],
    showcaseAria: "Previzualizare Autopilot One",
    pilotLive: "PILOT LIVE",
    aiReceptionist: "Recepționer AI",
    websiteConversation: "Conversație website",
    online: "online",
    visitorMessage: "Bună, vreau o programare și câteva detalii despre servicii.",
    aiMessage: "Sigur. Îți pot explica serviciile și pot trimite cererea către echipă. Pentru ce zi ai prefera programarea?",
    visitorFollowup: "Mâine după ora 15:00.",
    newLead: "Lead nou",
    appointmentRequested: "Programare cerută",
    qualifiedStatus: "Status: calificat",
    nextStep: "Pas următor",
    callClient: "Sună clientul",
    todayFollowup: "Follow-up: azi",
    leadCapture: "Captare leaduri",
    crmLite: "CRM Lite",
    analytics: "Analitice",
    whyEyebrow: "De ce contează",
    whyTitle: "Un website frumos nu ajunge dacă lead-urile nu sunt urmărite.",
    whyBody: "Autopilot One pune AI-ul la lucru în punctul cel mai important: conversația cu vizitatorul. Nu înlocuiește echipa, ci îi pregătește cererile bune și le face mai ușor de urmărit.",
    dashboardEyebrow: "Previzualizare dashboard",
    dashboardTitle: "Tot ce contează ajunge într-un flux clar.",
    dashboardBody: "Conversații, lead-uri, statusuri, activitate widget și follow-up-uri într-un singur loc, fără să pierzi contextul comercial.",
    conversations: "Conversații",
    lastSevenDays: "ultimele 7 zile",
    leads: "Lead-uri",
    readyForContact: "pregătite pentru contact",
    followup: "Follow-up",
    openActions: "acțiuni deschise",
    audienceEyebrow: "Pentru cine este",
    audienceTitle: "Creat pentru afaceri care primesc cereri repetitive.",
    audienceBody: "Ideal când clienții întreabă aceleași lucruri, echipa răspunde greu după program sau cererile ajung împrăștiate în e-mailuri, telefoane și mesaje.",
    faster: "Mai rapid",
    fasterBody: "Vizitatorul primește răspuns imediat, nu așteaptă până a doua zi.",
    clearer: "Mai clar",
    clearerBody: "Echipa vede cererile într-un dashboard, nu doar în notificări separate.",
    measurable: "Mai măsurabil",
    measurableBody: "Urmărești conversații, lead-uri, statusuri și activitate widget.",
    howEyebrow: "Cum pornim",
    howTitle: "Începem cu demo controlat, apoi extindem ce funcționează.",
    finalEyebrow: "Pregătit pentru demo",
    finalTitle: "Începe cu un caz real, nu cu un cont gol.",
    finalBody: "Trimite o cerere demo și stabilim primul flux AI potrivit pentru compania ta. După validare, activăm workspace-ul și configurarea completă.",
  },
  en: {
    metrics: [
      ["24/7", "AI reception for website visitors"],
      ["< 1 min", "lead ready for follow-up"],
      ["CRM", "status, internal note, next step"],
      ["Pilot", "controlled launch on your website"],
    ],
    features: [
      ["AI", "Smart web reception", "Answers questions, explains services and asks for the right details without feeling like a rigid form."],
      ["CRM", "Organized leads", "Requests land in a clear flow with status, internal note, next step and follow-up."],
      ["QA", "Control before launch", "Configure the knowledge base, allowed domains and response rules before real traffic."],
    ],
    audiences: [
      "Private clinics and practices",
      "Salons and local services",
      "Auto service businesses",
      "Consultants and agencies",
      "B2B companies with recurring requests",
      "Small teams losing leads after hours",
    ],
    steps: [
      ["01", "Discuss the use case", "Start with a demo request and choose the first flow: reception, FAQs, lead capture or request qualification."],
      ["02", "Load the information", "Add services, rules, prices, opening hours, FAQs and instructions for controlled replies."],
      ["03", "Start implementation", "Install the widget, track conversations and optimize every request until it becomes a clear flow."],
    ],
    trustItems: [
      ["No exposed token", "The widget snippet keeps sensitive data hidden in the interface."],
      ["Validated backup", "Local and off-server backup prepared for safe operation."],
      ["Hardened security", "Firewall, fail2ban, rate limits and security headers."],
      ["Final QA", "Homepage, API, SEO, backup and monitoring validated on the VPS."],
    ],
    beforeAfter: [
      ["Before", "Leads lost in the inbox, delayed replies and repetitive questions consuming the team’s time."],
      ["After", "The AI replies immediately, asks for the important details and sends the conversation into a simple CRM flow."],
    ],
    heroEyebrow: "AI Receptionist + CRM Lite",
    heroTitlePrefix: "An AI employee",
    heroTitleSuffix: " that turns visitors into tracked leads.",
    heroDescription: "Autopilot One turns your website into an active sales channel: it answers visitors, collects the important details and sends conversations to the CRM for follow-up.",
    createAccount: "Create workspace",
    requestDemo: "Request demo",
    viewPlans: "View plans",
    trustPage: "See how we work safely",
    kickers: ["No-card demo", "Guided pilot", "Controlled activation", "CRM Lite included"],
    showcaseAria: "Autopilot One preview",
    pilotLive: "LIVE PILOT",
    aiReceptionist: "AI Receptionist",
    websiteConversation: "Website conversation",
    online: "online",
    visitorMessage: "Hi, I’d like to book an appointment and get a few details about your services.",
    aiMessage: "Sure. I can explain the services and send the request to the team. Which day would you prefer for the appointment?",
    visitorFollowup: "Tomorrow after 3:00 PM.",
    newLead: "New lead",
    appointmentRequested: "Appointment requested",
    qualifiedStatus: "Status: qualified",
    nextStep: "Next step",
    callClient: "Call the client",
    todayFollowup: "Follow-up: today",
    leadCapture: "Lead capture",
    crmLite: "CRM Lite",
    analytics: "Analytics",
    whyEyebrow: "Why it matters",
    whyTitle: "A beautiful website is not enough if leads are not followed up.",
    whyBody: "Autopilot One puts AI to work at the most important point: the visitor conversation. It does not replace the team; it prepares good requests and makes them easier to track.",
    dashboardEyebrow: "Dashboard preview",
    dashboardTitle: "Everything important lands in one clear flow.",
    dashboardBody: "Conversations, leads, statuses, widget activity and follow-ups in one place, without losing commercial context.",
    conversations: "Conversations",
    lastSevenDays: "last 7 days",
    leads: "Leads",
    readyForContact: "ready for contact",
    followup: "Follow-up",
    openActions: "open actions",
    audienceEyebrow: "Who it is for",
    audienceTitle: "Built for businesses that receive repetitive requests.",
    audienceBody: "Ideal when customers ask the same things, the team replies slowly after hours or requests are scattered across emails, calls and messages.",
    faster: "Faster",
    fasterBody: "The visitor gets an immediate reply instead of waiting until the next day.",
    clearer: "Clearer",
    clearerBody: "The team sees requests in a dashboard, not only in separate notifications.",
    measurable: "More measurable",
    measurableBody: "Track conversations, leads, statuses and widget activity.",
    howEyebrow: "How we start",
    howTitle: "We start with a controlled demo, then expand what works.",
    finalEyebrow: "Ready for demo",
    finalTitle: "Start with a real use case, not an empty account.",
    finalBody: "Send a demo request and we will define the first AI flow for your company. After validation, we activate the workspace and complete the setup.",
  },
} as const;

export function HomeContent() {
  const copy = homeCopy[useAppLanguage()];

  return (
    <main className="container">
      <section className="hero hero-split premium-hero">
        <div>
          <div className="eyebrow">{copy.heroEyebrow}</div>
          <h1><span className="gradient-text">{copy.heroTitlePrefix}</span>{copy.heroTitleSuffix}</h1>
          <p className="lead-text">{copy.heroDescription}</p>
          <div className="actions">
            <Link href="/demo" className="button">{copy.requestDemo}</Link>
            <Link href="/pricing" className="button secondary">{copy.viewPlans}</Link>
            <Link href="/trust" className="button secondary">{copy.trustPage}</Link>
          </div>
          <div className="launch-kicker">
            {copy.kickers.map((kicker) => <span key={kicker}>{kicker}</span>)}
          </div>
        </div>

        <aside className="product-showcase" aria-label={copy.showcaseAria}>
          <div className="showcase-topbar">
            <div className="console-dots"><span /><span /><span /></div>
            <span>{copy.pilotLive}</span>
          </div>
          <div className="showcase-grid">
            <section className="ai-window">
              <div className="ai-window-header">
                <div>
                  <strong>{copy.aiReceptionist}</strong>
                  <span>{copy.websiteConversation}</span>
                </div>
                <em>{copy.online}</em>
              </div>
              <div className="chat-bubble visitor">{copy.visitorMessage}</div>
              <div className="chat-bubble ai">{copy.aiMessage}</div>
              <div className="chat-bubble visitor compact">{copy.visitorFollowup}</div>
            </section>

            <section className="crm-window">
              <div className="crm-card active">
                <span>{copy.newLead}</span>
                <strong>{copy.appointmentRequested}</strong>
                <p>{copy.qualifiedStatus}</p>
              </div>
              <div className="crm-card">
                <span>{copy.nextStep}</span>
                <strong>{copy.callClient}</strong>
                <p>{copy.todayFollowup}</p>
              </div>
            </section>
          </div>
          <div className="showcase-footer">
            <span>{copy.leadCapture}</span>
            <span>{copy.crmLite}</span>
            <span>{copy.analytics}</span>
          </div>
        </aside>
      </section>

      <section className="launch-strip premium-strip">
        {copy.metrics.map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="card section-heading statement-card">
        <div className="eyebrow">{copy.whyEyebrow}</div>
        <h2>{copy.whyTitle}</h2>
        <p>{copy.whyBody}</p>
      </section>

      <section className="grid three-columns">
        {copy.features.map(([icon, title, description]) => (
          <article className="card feature-card elevated-card" key={title}>
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="before-after-grid">
        {copy.beforeAfter.map(([title, description]) => (
          <article className="card before-after-card" key={title}>
            <div className="eyebrow">{title}</div>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="card dashboard-preview">
        <div>
          <div className="eyebrow">{copy.dashboardEyebrow}</div>
          <h2>{copy.dashboardTitle}</h2>
          <p>{copy.dashboardBody}</p>
        </div>
        <div className="dashboard-board">
          <article>
            <span>{copy.conversations}</span>
            <strong>38</strong>
            <p>{copy.lastSevenDays}</p>
          </article>
          <article>
            <span>{copy.leads}</span>
            <strong>12</strong>
            <p>{copy.readyForContact}</p>
          </article>
          <article>
            <span>{copy.followup}</span>
            <strong>5</strong>
            <p>{copy.openActions}</p>
          </article>
        </div>
      </section>

      <section className="card story-card">
        <div>
          <div className="eyebrow">{copy.audienceEyebrow}</div>
          <h2>{copy.audienceTitle}</h2>
          <p>{copy.audienceBody}</p>
          <div className="badge-list">
            {copy.audiences.map((audience) => <span key={audience}>{audience}</span>)}
          </div>
        </div>
        <div className="story-panel">
          <article>
            <strong>{copy.faster}</strong>
            <p>{copy.fasterBody}</p>
          </article>
          <article>
            <strong>{copy.clearer}</strong>
            <p>{copy.clearerBody}</p>
          </article>
          <article>
            <strong>{copy.measurable}</strong>
            <p>{copy.measurableBody}</p>
          </article>
        </div>
      </section>

      <section className="section-heading">
        <div className="eyebrow">{copy.howEyebrow}</div>
        <h2>{copy.howTitle}</h2>
      </section>

      <section className="grid three-columns">
        {copy.steps.map(([number, title, description]) => (
          <article className="card" key={title}>
            <div className="step-number">{number}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="trust-band premium-trust">
        {copy.trustItems.map(([title, description]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="card cta-card final-cta-card">
        <div>
          <div className="eyebrow">{copy.finalEyebrow}</div>
          <h2>{copy.finalTitle}</h2>
          <p>{copy.finalBody}</p>
        </div>
        <Link href="/demo" className="button">{copy.requestDemo}</Link>
      </section>
    </main>
  );
}
