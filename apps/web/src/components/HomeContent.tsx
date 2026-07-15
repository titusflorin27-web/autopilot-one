"use client";

import Link from "next/link";
import { useAppLanguage } from "../lib/useAppLanguage";
import styles from "./HomeContent.module.css";

const cx = (...classNames: Array<string | false | null | undefined>) => classNames.filter(Boolean).join(" ");

const homeCopy = {
  ro: {
    heroEyebrow: "AI Website Agent + CRM Lite",
    heroTitlePrefix: "Un angajat AI",
    heroTitleSuffix: " care analizează, răspunde și pregătește leadurile pentru follow-up.",
    heroDescription:
      "Autopilot One transformă website-ul într-un flux AI controlat: răspunde vizitatorilor, colectează leaduri, organizează conversațiile în CRM Lite și pregătește pașii următori pentru tine.",
    analyzeWebsite: "Analizează website-ul",
    requestDemo: "Cere demo",
    viewPlans: "Vezi planurile",
    trustPage: "Vezi cum lucrăm sigur",
    heroKickers: ["Demo-first", "AI Agent", "CRM Lite", "95% automation roadmap"],
    consoleStatus: "CONTROLLED LAUNCH",
    consoleTitle: "AI Sales Autopilot",
    consoleSubtitle: "Website analysis → plan recommendation → lead follow-up",
    visitorMessage: "Bună, vreau să văd dacă un agent AI se potrivește site-ului meu.",
    aiMessage:
      "Pot analiza cazul de utilizare, pot recomanda un plan și pot pregăti întrebările pentru demo. Care este website-ul tău?",
    websiteUrl: "client-website.ro",
    leadScore: "Lead score",
    recommendation: "Recomandare",
    starterPlan: "Starter / Pro după demo",
    ownerGate: "Aprobare owner înainte de activare",
    metrics: [
      { value: "24/7", label: "răspuns AI pentru vizitatori" },
      { value: "CRM", label: "leaduri, statusuri și follow-up" },
      { value: "Demo", label: "activare controlată înainte de plată" },
      { value: "95%", label: "țintă de automatizare cu aprobări umane" },
    ],
    productEyebrow: "Platformă AI pentru vânzare și suport",
    productTitle: "Nu construim doar un chat. Construim un flux AI complet pentru IMM-uri.",
    productDescription:
      "Inspirat de structura platformelor SaaS moderne, dar original pentru Autopilot One: agent AI, lead capture, CRM Lite, knowledge base, automatizări și monitorizare într-un proces controlat.",
    products: [
      {
        label: "AI Website Agent",
        title: "Răspunde vizitatorilor în timp real",
        body: "Agentul explică serviciile, pune întrebări de calificare și știe când să trimită conversația către un om.",
      },
      {
        label: "Lead Capture",
        title: "Transformă conversațiile în oportunități",
        body: "Colectează nume, email, telefon, nevoie, sursă și context, apoi pregătește follow-up-ul.",
      },
      {
        label: "CRM Lite / Inbox",
        title: "Toate cererile într-un singur loc",
        body: "Vezi conversații, statusuri, scoruri, notițe interne, taskuri și următorul pas pentru fiecare lead.",
      },
      {
        label: "Knowledge Base",
        title: "Răspunsuri bazate pe surse controlate",
        body: "AI-ul folosește pagini, FAQ-uri, documente și reguli aprobate, nu promisiuni inventate.",
      },
    ],
    flowEyebrow: "Fluxul clientului",
    flowTitle: "De la vizitator la client potențial, cu AI pe aproape tot traseul.",
    flowSteps: [
      ["01", "Analiză website", "Clientul cere demo sau analiză. AI-ul pregătește contextul și primul caz de utilizare."],
      ["02", "Recomandare plan", "Sistemul propune Pilot, Starter, Pro sau Business, dar activarea rămâne controlată."],
      ["03", "Onboarding ghidat", "AI cere informațiile necesare, pregătește profilul firmei și baza de cunoștințe."],
      ["04", "Go-live aprobat", "Widgetul se testează, se validează conversațiile și ownerul aprobă lansarea."],
      ["05", "Monitorizare", "AI urmărește conversații, leaduri, riscuri și recomandări de optimizare sau upgrade."],
    ],
    automationEyebrow: "AI automation 95%",
    automationTitle: "AI execută. Omul aprobă. Sistemul loghează.",
    automationDescription:
      "Ținta noastră nu este un chatbot fără control. Ținta este un autopilot operațional în care AI-ul pregătește munca, iar tu intervii doar la decizii critice.",
    automationCards: [
      ["AI execută", "analiză website, scor lead, draft ofertă, onboarding, knowledge base și follow-up"],
      ["Tu aprobi", "ofertă finală, plan plătit, go-live, contracte Business, GDPR și situații sensibile"],
      ["Sistemul loghează", "taskuri, statusuri, decizii, conversații, notificări și recomandări de upgrade"],
    ],
    useCasesEyebrow: "Pentru cine construim",
    useCasesTitle: "Afaceri care primesc întrebări repetitive și pierd leaduri după program.",
    useCases: [
      "Servicii locale",
      "Clinici și cabinete",
      "Consultanță și agenții",
      "Service-uri auto",
      "Ecommerce cu întrebări recurente",
      "B2B cu cereri de ofertă",
    ],
    trustEyebrow: "Lansare controlată",
    trustTitle: "Fără promisiuni false. Fără taxare automată ascunsă. Fără go-live fără test.",
    trustItems: [
      "Planul se confirmă după demo.",
      "Stripe live rămâne o etapă separată.",
      "AI-ul folosește surse aprobate.",
      "Conversațiile importante pot fi transferate la om.",
      "Datele firmei și legalul final se adaugă înainte de activare comercială completă.",
    ],
    finalEyebrow: "Următorul pas",
    finalTitle: "Începem cu analiza website-ului și primul flux AI potrivit.",
    finalBody:
      "Trimite cererea demo, alegem primul caz de utilizare și pornim cu o implementare controlată. După validare, extindem spre AI Sales Autopilot.",
  },
  en: {
    heroEyebrow: "AI Website Agent + CRM Lite",
    heroTitlePrefix: "An AI employee",
    heroTitleSuffix: " that analyzes, replies and prepares leads for follow-up.",
    heroDescription:
      "Autopilot One turns your website into a controlled AI flow: it answers visitors, captures leads, organizes conversations in CRM Lite and prepares next steps for you.",
    analyzeWebsite: "Analyze website",
    requestDemo: "Request demo",
    viewPlans: "View plans",
    trustPage: "See how we work safely",
    heroKickers: ["Demo-first", "AI Agent", "CRM Lite", "95% automation roadmap"],
    consoleStatus: "CONTROLLED LAUNCH",
    consoleTitle: "AI Sales Autopilot",
    consoleSubtitle: "Website analysis → plan recommendation → lead follow-up",
    visitorMessage: "Hi, I want to see whether an AI agent fits my website.",
    aiMessage:
      "I can analyze the use case, recommend a plan and prepare the demo questions. What is your website?",
    websiteUrl: "client-website.com",
    leadScore: "Lead score",
    recommendation: "Recommendation",
    starterPlan: "Starter / Pro after demo",
    ownerGate: "Owner approval before activation",
    metrics: [
      { value: "24/7", label: "AI replies for visitors" },
      { value: "CRM", label: "leads, statuses and follow-up" },
      { value: "Demo", label: "controlled activation before payment" },
      { value: "95%", label: "automation target with human approvals" },
    ],
    productEyebrow: "AI platform for sales and support",
    productTitle: "We are not building only a chat. We are building a complete AI flow for small businesses.",
    productDescription:
      "Inspired by modern SaaS structure, but original for Autopilot One: AI agent, lead capture, CRM Lite, knowledge base, automations and monitoring in a controlled process.",
    products: [
      {
        label: "AI Website Agent",
        title: "Reply to visitors in real time",
        body: "The agent explains services, asks qualification questions and knows when to send the conversation to a human.",
      },
      {
        label: "Lead Capture",
        title: "Turn conversations into opportunities",
        body: "Collect name, email, phone, need, source and context, then prepare follow-up.",
      },
      {
        label: "CRM Lite / Inbox",
        title: "All requests in one place",
        body: "See conversations, statuses, scores, internal notes, tasks and the next step for every lead.",
      },
      {
        label: "Knowledge Base",
        title: "Answers based on controlled sources",
        body: "AI uses approved pages, FAQs, documents and rules, not invented promises.",
      },
    ],
    flowEyebrow: "Client journey",
    flowTitle: "From visitor to potential client, with AI across most of the journey.",
    flowSteps: [
      ["01", "Website analysis", "The client requests a demo or analysis. AI prepares the context and first use case."],
      ["02", "Plan recommendation", "The system proposes Pilot, Starter, Pro or Business, while activation stays controlled."],
      ["03", "Guided onboarding", "AI asks for the required information, prepares the company profile and knowledge base."],
      ["04", "Approved go-live", "The widget is tested, conversations are validated and the owner approves launch."],
      ["05", "Monitoring", "AI tracks conversations, leads, risks and optimization or upgrade recommendations."],
    ],
    automationEyebrow: "AI automation 95%",
    automationTitle: "AI executes. Human approves. The system logs.",
    automationDescription:
      "Our target is not an uncontrolled chatbot. The target is an operational autopilot where AI prepares the work and you step in only for critical decisions.",
    automationCards: [
      ["AI executes", "website analysis, lead score, offer draft, onboarding, knowledge base and follow-up"],
      ["You approve", "final offer, paid plan, go-live, Business contracts, GDPR and sensitive cases"],
      ["System logs", "tasks, statuses, decisions, conversations, notifications and upgrade recommendations"],
    ],
    useCasesEyebrow: "Who we build for",
    useCasesTitle: "Businesses that receive repetitive questions and lose leads after hours.",
    useCases: [
      "Local services",
      "Clinics and practices",
      "Consultants and agencies",
      "Auto service businesses",
      "Ecommerce with recurring questions",
      "B2B quote requests",
    ],
    trustEyebrow: "Controlled launch",
    trustTitle: "No false promises. No hidden automatic charges. No go-live without testing.",
    trustItems: [
      "The plan is confirmed after demo.",
      "Stripe live remains a separate stage.",
      "AI uses approved sources.",
      "Important conversations can be handed off to a human.",
      "Company details and final legal review are added before full commercial activation.",
    ],
    finalEyebrow: "Next step",
    finalTitle: "Start with website analysis and the first suitable AI flow.",
    finalBody:
      "Send the demo request, we choose the first use case and start with a controlled implementation. After validation, we expand toward AI Sales Autopilot.",
  },
} as const;

export function HomeContent() {
  const copy = homeCopy[useAppLanguage()];

  return (
    <main className={cx("container", styles.homeShell)}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <div className="eyebrow">{copy.heroEyebrow}</div>
          <h1>
            <span className="gradient-text">{copy.heroTitlePrefix}</span>{copy.heroTitleSuffix}
          </h1>
          <p className="lead-text">{copy.heroDescription}</p>
          <div className="actions">
            <Link href="/demo?intent=website-analysis" className="button">{copy.analyzeWebsite}</Link>
            <Link href="/demo" className="button secondary">{copy.requestDemo}</Link>
            <Link href="/pricing" className="button secondary">{copy.viewPlans}</Link>
            <Link href="/trust" className="button secondary">{copy.trustPage}</Link>
          </div>
          <div className="launch-kicker">
            {copy.heroKickers.map((kicker) => <span key={kicker}>{kicker}</span>)}
          </div>
        </div>

        <aside className={styles.autopilotConsole} aria-label={copy.consoleTitle}>
          <div className={styles.consoleTopbar}>
            <div className={styles.consoleDots}><span /><span /><span /></div>
            <strong>{copy.consoleStatus}</strong>
          </div>
          <div className={styles.consoleHeader}>
            <span>{copy.consoleTitle}</span>
            <p>{copy.consoleSubtitle}</p>
          </div>
          <div className={styles.chatStack}>
            <div className={cx(styles.chatBubble, styles.visitorBubble)}>{copy.visitorMessage}</div>
            <div className={cx(styles.chatBubble, styles.aiBubble)}>{copy.aiMessage}</div>
          </div>
          <div className={styles.analysisPanel}>
            <div>
              <span>{copy.websiteUrl}</span>
              <strong>{copy.leadScore}: 75</strong>
            </div>
            <div>
              <span>{copy.recommendation}</span>
              <strong>{copy.starterPlan}</strong>
            </div>
          </div>
          <div className={styles.approvalGate}>{copy.ownerGate}</div>
        </aside>
      </section>

      <section className={styles.metricsStrip}>
        {copy.metrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className={cx("card", styles.sectionIntro)}>
        <div className="eyebrow">{copy.productEyebrow}</div>
        <h2>{copy.productTitle}</h2>
        <p>{copy.productDescription}</p>
      </section>

      <section className={styles.productGrid}>
        {copy.products.map((product) => (
          <article className={cx("card", styles.productCard)} key={product.label}>
            <span>{product.label}</span>
            <h3>{product.title}</h3>
            <p>{product.body}</p>
          </article>
        ))}
      </section>

      <section className={cx("card", styles.flowSection)}>
        <div>
          <div className="eyebrow">{copy.flowEyebrow}</div>
          <h2>{copy.flowTitle}</h2>
        </div>
        <div className={styles.flowTimeline}>
          {copy.flowSteps.map(([number, title, description]) => (
            <article key={number}>
              <strong>{number}</strong>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.automationSection}>
        <div className={cx("card", styles.automationLead)}>
          <div className="eyebrow">{copy.automationEyebrow}</div>
          <h2>{copy.automationTitle}</h2>
          <p>{copy.automationDescription}</p>
        </div>
        <div className={styles.automationCards}>
          {copy.automationCards.map(([title, body]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={cx("card", styles.useCaseSection)}>
        <div>
          <div className="eyebrow">{copy.useCasesEyebrow}</div>
          <h2>{copy.useCasesTitle}</h2>
        </div>
        <div className="badge-list">
          {copy.useCases.map((useCase) => <span key={useCase}>{useCase}</span>)}
        </div>
      </section>

      <section className={cx("card", styles.trustSection)}>
        <div>
          <div className="eyebrow">{copy.trustEyebrow}</div>
          <h2>{copy.trustTitle}</h2>
        </div>
        <ul className="check-list">
          {copy.trustItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className={cx("card", "cta-card", styles.finalCta)}>
        <div>
          <div className="eyebrow">{copy.finalEyebrow}</div>
          <h2>{copy.finalTitle}</h2>
          <p>{copy.finalBody}</p>
        </div>
        <Link href="/demo?intent=website-analysis" className="button">{copy.analyzeWebsite}</Link>
      </section>
    </main>
  );
}
