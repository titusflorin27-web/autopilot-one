import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Politica de cookies Autopilot One",
  description:
    "Politica de cookies și browser storage Autopilot One: stocare locală, autentificare, limbă, demo widget și controlul datelor.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack legal-page">
        <section className="card">
          <div className="eyebrow">Cookies / browser storage</div>
          <h1>Politica de cookies și stocare locală</h1>
          <p>
            Această pagină explică modul în care Autopilot One folosește cookies, localStorage și tehnologii similare în faza pilot.
            Documentul este informativ și trebuie revizuit juridic înainte de lansarea comercială completă.
          </p>
        </section>

        <section className="card trust-layout">
          <h2>Rezumat</h2>
          <p>
            În prezent, Autopilot One nu folosește cookie-uri de advertising, pixeli de marketing sau analytics terț pe interfața publică.
            Aplicația folosește stocare locală pentru funcții esențiale: autentificare, preferința de limbă și demo widget.
          </p>

          <h2>Stocare strict necesară</h2>
          <ul className="check-list">
            <li>token-uri de autentificare stocate local pentru sesiunea utilizatorului conectat;</li>
            <li>preferința de limbă, pentru a păstra interfața în română sau engleză;</li>
            <li>un identificator local pentru demo-ul widgetului, ca să poată simula o conversație consecventă;</li>
            <li>loguri tehnice de server folosite pentru securitate, depanare și prevenirea abuzului.</li>
          </ul>

          <h2>Ce nu folosim în prezent</h2>
          <ul className="check-list">
            <li>nu folosim Google Analytics, Meta Pixel sau alte scripturi de tracking publicitar;</li>
            <li>nu folosim cookie-uri de remarketing;</li>
            <li>nu vindem date personale către advertiseri;</li>
            <li>nu plasăm cookies opționale înainte de consimțământ.</li>
          </ul>

          <h2>Când ar fi necesar consimțământ</h2>
          <p>
            Dacă vom introduce analytics opțional, remarketing, A/B testing non-esențial sau alte tehnologii similare,
            vom cere consimțământ înainte de activare și vom oferi o opțiune de retragere.
          </p>

          <h2>Cum poți controla stocarea</h2>
          <p>
            Poți șterge datele locale din setările browserului. Dacă ștergi token-urile de autentificare, vei fi delogat.
            Pentru cereri privind datele personale, consultă <Link href="/privacy">Politica de confidențialitate</Link>.
          </p>

          <h2>Contact</h2>
          <p>Pentru întrebări despre cookies, browser storage sau date personale, contactează-ne la contact@autopilot-one.com.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
