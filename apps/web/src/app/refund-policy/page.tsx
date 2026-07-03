import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Politica de rambursare Autopilot One",
  description:
    "Politica de rambursare Autopilot One pentru abonamente, servicii digitale activate, faza pilot și solicitări de refund.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack legal-page">
        <section className="card">
          <div className="eyebrow">Rambursări</div>
          <h1>Politica de rambursare</h1>
          <p>Această politică este un model operațional pentru faza pilot și trebuie revizuită juridic înainte de lansarea comercială completă.</p>
        </section>

        <section className="card trust-layout">
          <h2>Abonamente</h2>
          <p>Autopilot One poate fi oferit pe bază de abonament lunar sau ofertă personalizată. Facturarea, perioada de test și condițiile comerciale se stabilesc în pagina de pricing, în checkoutul furnizorului de plăți sau în oferta acceptată.</p>

          <h2>Anulare și portal de facturare</h2>
          <p>După activarea plăților online, gestionarea abonamentului, anularea și facturile pot fi disponibile prin portalul furnizorului de plăți. Până la activarea completă a plăților, solicitările se gestionează prin contact@autopilot-one.com.</p>

          <h2>Servicii digitale activate</h2>
          <p>Pentru servicii digitale configurate și activate, rambursarea poate depinde de stadiul implementării și de consumul efectiv al serviciului.</p>

          <h2>Faza pilot</h2>
          <p>În perioada pilot, cererile de rambursare se analizează individual, ținând cont de configurarea efectuată, timpul de suport, utilizarea serviciului și eventualele costuri externe generate.</p>

          <h2>Cum soliciți o rambursare</h2>
          <ul className="check-list">
            <li>trimite un e-mail la contact@autopilot-one.com;</li>
            <li>include numele companiei, e-mailul contului și motivul cererii;</li>
            <li>menționează data activării și planul folosit;</li>
            <li>echipa analizează cererea și răspunde cu opțiunile disponibile.</li>
          </ul>

          <h2>Excepții</h2>
          <p>Rambursările pot fi refuzate în caz de abuz, utilizare substanțială, încălcarea termenilor sau servicii custom deja prestate.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
