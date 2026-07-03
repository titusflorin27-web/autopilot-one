import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Drepturile consumatorului Autopilot One",
  description:
    "Informații Autopilot One pentru consumatori: B2C/B2B, drept de retragere, servicii digitale, reclamații și soluționare.",
  path: "/consumer-rights",
});

export default function ConsumerRightsPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack legal-page">
        <section className="card">
          <div className="eyebrow">Drepturile consumatorului</div>
          <h1>Informații pentru consumatori</h1>
          <p>Această pagină este un model informativ pentru pilot și trebuie revizuită juridic înainte de lansarea comercială completă.</p>
        </section>

        <section className="card trust-layout">
          <h2>B2C și B2B</h2>
          <p>Drepturile consumatorului se pot aplica atunci când clientul este consumator persoană fizică. Pentru contractele B2B, relația poate fi guvernată de termenii comerciali agreați între părți.</p>

          <h2>Drept de retragere</h2>
          <p>În contextul general al legislației UE, consumatorii pot avea un drept de retragere de 14 zile pentru anumite achiziții la distanță. Pot exista excepții sau condiții speciale pentru servicii digitale începute, configurate sau furnizate cu acordul clientului.</p>

          <h2>Servicii digitale</h2>
          <p>Pentru servicii digitale, configurări, activări sau consum efectiv al serviciului, dreptul de retragere și rambursarea pot depinde de situația concretă și de legislația aplicabilă.</p>

          <h2>Reclamații și soluționare</h2>
          <p>Pentru întrebări, reclamații sau solicitări, contactează contact@autopilot-one.com. Consumatorii pot consulta și canalele ANPC, mecanismele SAL și platformele de soluționare online a litigiilor, după caz.</p>

          <h2>Informații precontractuale</h2>
          <p>Înainte de o achiziție B2C, clientul trebuie să primească informații clare despre furnizor, caracteristicile serviciului digital, preț, durată, reînnoire, anulare, dreptul de retragere și eventualele excepții aplicabile serviciilor digitale.</p>

          <h2>Recomandare</h2>
          <p>Aceste informații nu reprezintă consultanță juridică. Înainte de lansarea comercială completă, documentele trebuie revizuite de un specialist juridic.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
