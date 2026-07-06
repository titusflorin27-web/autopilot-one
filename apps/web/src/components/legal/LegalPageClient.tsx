"use client";

import Link from "next/link";
import { useAppLanguage } from "../../lib/useAppLanguage";

type LegalPageKey = "privacy" | "cookies" | "terms" | "refundPolicy" | "consumerRights";

type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  link?: { href: string; label: string };
};

type LegalPageCopy = {
  eyebrow: string;
  title: string;
  intro: string[];
  sections: LegalSection[];
};

const legalCopy: Record<LegalPageKey, Record<"ro" | "en", LegalPageCopy>> = {
  privacy: {
    ro: {
      eyebrow: "Confidențialitate / GDPR",
      title: "Politica de confidențialitate",
      intro: [
        "Această pagină descrie modul în care Autopilot One tratează datele în utilizarea platformei.",
        "Documentul este actualizat pe măsură ce platforma, furnizorii și configurările comerciale evoluează.",
      ],
      sections: [
        { title: "Operatorul datelor", paragraphs: ["Operatorul comercial al serviciului este entitatea indicată în oferta sau contractul acceptat de client. Pentru întrebări operaționale poți folosi contact@autopilot-one.com.", "În funcție de caz, Autopilot One poate acționa ca operator pentru conturi, demo requests și relația comercială, respectiv ca persoană împuternicită pentru datele introduse de clienți despre vizitatorii lor."] },
        { title: "Date care pot fi prelucrate", list: ["date de cont: nume, e-mail, rol, organizație, parolă hashuită și setări de workspace;", "date de demo request: nume, e-mail, telefon, companie, website și mesaj transmis;", "conversații cu vizitatorii, mesaje, sumar lead, scor lead, statusuri și taskuri de follow-up;", "date de widget: website/origin, visitor id, evenimente, user agent, loguri tehnice și date de securitate;", "conținut încărcat în baza de cunoștințe a companiei;", "date de billing: plan, status abonament, identificatori Stripe și evenimente de facturare, dacă Stripe este configurat."] },
        { title: "Scopuri", list: ["furnizarea serviciului, contului și workspace-ului;", "autentificare, securitate, prevenirea abuzului și depanare;", "răspunsuri AI, conversații, captare lead-uri și follow-up operațional;", "gestionarea demo request-urilor, suportului și comunicărilor comerciale solicitate;", "billing, planuri, limite de utilizare și conformitate contractuală;"] },
        { title: "AI și conținut generat", paragraphs: ["Răspunsurile AI pot fi incomplete sau eronate. Nu introduce informații sensibile sau inutile pentru scopul conversației. Clienții sunt responsabili să configureze baza de cunoștințe, widgetul și instrucțiunile AI astfel încât să respecte legislația aplicabilă."] },
        { title: "Furnizori", paragraphs: ["Serviciul poate folosi furnizori de infrastructură, email, AI, plăți și hosting. Configurația exactă depinde de mediul comercial activ și de furnizorii activați pe server."] },
        { title: "Cookies și stocare locală", paragraphs: ["În prezent nu folosim tracking publicitar sau analytics terț pe interfața publică. Folosim stocare locală pentru autentificare, preferința de limbă și demo widget."], link: { href: "/cookies", label: "Politica de cookies" } },
        { title: "Drepturile GDPR", paragraphs: ["În funcție de situație, persoanele vizate pot solicita acces, rectificare, ștergere, restricționare, opoziție, portabilitate și retragerea consimțământului unde se aplică. Poți trimite cereri la contact@autopilot-one.com."] },
      ],
    },
    en: {
      eyebrow: "Privacy / GDPR",
      title: "Privacy policy",
      intro: ["This page explains how Autopilot One handles data when the platform is used.", "The document is updated as the platform, providers and commercial configuration evolve."],
      sections: [
        { title: "Data controller", paragraphs: ["The commercial operator of the service is the entity stated in the offer or contract accepted by the customer. For operational questions, use contact@autopilot-one.com.", "Depending on the case, Autopilot One may act as controller for accounts, demo requests and the commercial relationship, and as processor for data entered by customers about their visitors."] },
        { title: "Data that may be processed", list: ["account data: name, email, role, organization, hashed password and workspace settings;", "demo request data: name, email, phone, company, website and submitted message;", "visitor conversations, messages, lead summary, lead score, statuses and follow-up tasks;", "widget data: website/origin, visitor id, events, user agent, technical logs and security data;", "content uploaded to the company knowledge base;", "billing data: plan, subscription status, Stripe identifiers and billing events if Stripe is configured."] },
        { title: "Purposes", list: ["providing the service, account and workspace;", "authentication, security, abuse prevention and troubleshooting;", "AI replies, conversations, lead capture and operational follow-up;", "handling demo requests, support and requested commercial communication;", "billing, plans, usage limits and contractual compliance;"] },
        { title: "AI and generated content", paragraphs: ["AI replies may be incomplete or incorrect. Do not enter sensitive or unnecessary information for the purpose of the conversation. Customers are responsible for configuring the knowledge base, widget and AI instructions in line with applicable law."] },
        { title: "Providers", paragraphs: ["The service may use infrastructure, email, AI, payment and hosting providers. The exact configuration depends on the active commercial environment and enabled providers."] },
        { title: "Cookies and local storage", paragraphs: ["We currently do not use advertising tracking or third-party analytics on the public interface. We use local storage for authentication, language preference and widget demo functionality."], link: { href: "/cookies", label: "Cookie policy" } },
        { title: "GDPR rights", paragraphs: ["Depending on the situation, data subjects may request access, rectification, deletion, restriction, objection, portability and consent withdrawal where applicable. Requests can be sent to contact@autopilot-one.com."] },
      ],
    },
  },
  cookies: {
    ro: {
      eyebrow: "Cookies / browser storage",
      title: "Politica de cookies și stocare locală",
      intro: ["Această pagină explică modul în care Autopilot One folosește cookies, localStorage și tehnologii similare în configurarea actuală."],
      sections: [
        { title: "Rezumat", paragraphs: ["În prezent, Autopilot One nu folosește cookie-uri de advertising, pixeli de marketing sau analytics terț pe interfața publică. Aplicația folosește stocare locală pentru funcții esențiale: autentificare, preferința de limbă și demo widget."] },
        { title: "Stocare strict necesară", list: ["token-uri de autentificare stocate local pentru sesiunea utilizatorului conectat;", "preferința de limbă, pentru a păstra interfața în română sau engleză;", "un identificator local pentru demo-ul widgetului;", "loguri tehnice de server folosite pentru securitate, depanare și prevenirea abuzului."] },
        { title: "Ce nu folosim în prezent", list: ["nu folosim Google Analytics, Meta Pixel sau alte scripturi de tracking publicitar;", "nu folosim cookie-uri de remarketing;", "nu vindem date personale către advertiseri;", "nu plasăm cookies opționale înainte de consimțământ."] },
        { title: "Control", paragraphs: ["Poți șterge datele locale din setările browserului. Dacă ștergi token-urile de autentificare, vei fi delogat."], link: { href: "/privacy", label: "Politica de confidențialitate" } },
      ],
    },
    en: {
      eyebrow: "Cookies / browser storage",
      title: "Cookie and local storage policy",
      intro: ["This page explains how Autopilot One uses cookies, localStorage and similar technologies in the current configuration."],
      sections: [
        { title: "Summary", paragraphs: ["Autopilot One currently does not use advertising cookies, marketing pixels or third-party analytics on the public interface. The app uses local storage for essential functions: authentication, language preference and widget demo."] },
        { title: "Strictly necessary storage", list: ["authentication tokens stored locally for the signed-in user session;", "language preference, to keep the interface in Romanian or English;", "a local identifier for the widget demo;", "technical server logs used for security, troubleshooting and abuse prevention."] },
        { title: "What we do not currently use", list: ["we do not use Google Analytics, Meta Pixel or other advertising tracking scripts;", "we do not use remarketing cookies;", "we do not sell personal data to advertisers;", "we do not place optional cookies before consent."] },
        { title: "Control", paragraphs: ["You can delete local data from your browser settings. If you delete authentication tokens, you will be logged out."], link: { href: "/privacy", label: "Privacy policy" } },
      ],
    },
  },
  terms: {
    ro: { eyebrow: "Termeni", title: "Termeni și condiții", intro: ["Acest document descrie cadrul operațional de utilizare a platformei Autopilot One."], sections: [
      { title: "Furnizor", paragraphs: ["Serviciul este furnizat de entitatea comercială indicată în oferta sau contractul acceptat de client. Contact operațional: contact@autopilot-one.com."] },
      { title: "Serviciul", paragraphs: ["Autopilot One oferă instrumente software pentru widget web, bază de cunoștințe, conversații asistate de AI, captare lead-uri și management operațional."] },
      { title: "Acces și conturi", paragraphs: ["Clientul este responsabil pentru securitatea contului, utilizarea parolelor sigure și acordarea accesului doar persoanelor autorizate."] },
      { title: "Utilizare acceptabilă", paragraphs: ["Este interzisă utilizarea serviciului pentru conținut ilegal, abuziv, fraudulos, spam sau încercări de acces neautorizat."] },
      { title: "Limitări AI", paragraphs: ["Răspunsurile generate de AI pot fi incomplete sau eronate. Clientul rămâne responsabil pentru verificarea informațiilor sensibile."] },
    ] },
    en: { eyebrow: "Terms", title: "Terms and conditions", intro: ["This document describes the operational framework for using the Autopilot One platform."], sections: [
      { title: "Provider", paragraphs: ["The service is provided by the commercial entity stated in the offer or contract accepted by the customer. Operational contact: contact@autopilot-one.com."] },
      { title: "Service", paragraphs: ["Autopilot One provides software tools for web widgets, knowledge base, AI-assisted conversations, lead capture and operational management."] },
      { title: "Access and accounts", paragraphs: ["The customer is responsible for account security, using strong passwords and granting access only to authorized people."] },
      { title: "Acceptable use", paragraphs: ["The service must not be used for illegal, abusive, fraudulent or spam content, or attempts at unauthorized access."] },
      { title: "AI limitations", paragraphs: ["AI-generated replies may be incomplete or incorrect. The customer remains responsible for checking sensitive information."] },
    ] },
  },
  refundPolicy: {
    ro: { eyebrow: "Rambursări", title: "Politica de rambursare", intro: ["Această politică descrie modul în care sunt analizate solicitările de rambursare pentru serviciile Autopilot One."], sections: [
      { title: "Abonamente", paragraphs: ["Autopilot One poate fi oferit pe bază de abonament lunar sau ofertă personalizată."] },
      { title: "Anulare și portal de facturare", paragraphs: ["După activarea plăților online, gestionarea abonamentului și facturile pot fi disponibile prin portalul furnizorului de plăți."] },
      { title: "Cum soliciți o rambursare", list: ["trimite un e-mail la contact@autopilot-one.com;", "include numele companiei, e-mailul contului și motivul cererii;", "menționează data activării și planul folosit."] },
    ] },
    en: { eyebrow: "Refunds", title: "Refund policy", intro: ["This policy explains how refund requests for Autopilot One services are reviewed."], sections: [
      { title: "Subscriptions", paragraphs: ["Autopilot One may be offered as a monthly subscription or custom offer."] },
      { title: "Cancellation and billing portal", paragraphs: ["After online payments are enabled, subscription management and invoices may be available through the payment provider portal."] },
      { title: "How to request a refund", list: ["send an email to contact@autopilot-one.com;", "include the company name, account email and reason for the request;", "mention the activation date and plan used."] },
    ] },
  },
  consumerRights: {
    ro: { eyebrow: "Drepturile consumatorului", title: "Informații pentru consumatori", intro: ["Această pagină prezintă informații generale pentru consumatori și modul în care pot fi transmise întrebări, reclamații sau solicitări."], sections: [
      { title: "B2C și B2B", paragraphs: ["Drepturile consumatorului se pot aplica atunci când clientul este consumator persoană fizică. Pentru contractele B2B, relația poate fi guvernată de termenii comerciali agreați între părți."] },
      { title: "Drept de retragere", paragraphs: ["Consumatorii pot avea un drept de retragere de 14 zile pentru anumite achiziții la distanță, cu excepții pentru servicii digitale începute sau furnizate cu acordul clientului."] },
      { title: "Reclamații", paragraphs: ["Pentru întrebări, reclamații sau solicitări, contactează contact@autopilot-one.com."] },
    ] },
    en: { eyebrow: "Consumer rights", title: "Consumer information", intro: ["This page provides general consumer information and explains how questions, complaints or requests can be submitted."], sections: [
      { title: "B2C and B2B", paragraphs: ["Consumer rights may apply when the customer is a natural person acting as a consumer. For B2B contracts, the relationship may be governed by the commercial terms agreed between the parties."] },
      { title: "Withdrawal right", paragraphs: ["Consumers may have a 14-day withdrawal right for certain distance purchases, with exceptions for digital services started or provided with the customer’s agreement."] },
      { title: "Complaints", paragraphs: ["For questions, complaints or requests, contact contact@autopilot-one.com."] },
    ] },
  },
};

export function LegalPageClient({ pageKey }: { pageKey: LegalPageKey }) {
  const copy = legalCopy[pageKey][useAppLanguage()];

  return (
    <main className="container page-stack legal-page">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        {copy.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <section className="card trust-layout">
        {copy.sections.map((section) => (
          <div key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.list ? (
              <ul className="check-list">
                {section.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
            {section.link ? <p><Link href={section.link.href}>{section.link.label}</Link></p> : null}
          </div>
        ))}
      </section>
    </main>
  );
}
