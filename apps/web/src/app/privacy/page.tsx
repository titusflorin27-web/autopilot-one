import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Politica de confidențialitate Autopilot One",
  description:
    "Politica de confidențialitate Autopilot One pentru faza pilot: date prelucrate, scopuri, drepturi GDPR și utilizarea AI.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack legal-page">
        <section className="card">
          <div className="eyebrow">Confidențialitate / GDPR</div>
          <h1>Politica de confidențialitate</h1>
          <p>
            Această pagină descrie modul în care Autopilot One tratează datele în faza de pilot. Documentul trebuie revizuit juridic înainte de lansarea comercială completă.
          </p>
        </section>

        <section className="card trust-layout">
          <h2>Operatorul datelor</h2>
          <p>Operatorul comercial al serviciului este entitatea indicată în oferta sau contractul acceptat de client. Pentru întrebări operaționale poți folosi contact@autopilot-one.com.</p>
          <p>În funcție de caz, Autopilot One poate acționa ca operator pentru conturile clienților și ca persoană împuternicită pentru datele introduse de clienți în platformă.</p>

          <h2>Date care pot fi prelucrate</h2>
          <ul className="check-list">
            <li>date de cont: nume, e-mail, rol, organizație;</li>
            <li>conversații cu clienți și mesaje trimise prin widget;</li>
            <li>nume, e-mail și alte date de contact furnizate de vizitatori;</li>
            <li>evenimente ale widgetului, sursa website-ului, loguri tehnice și date de securitate;</li>
            <li>conținut încărcat în baza de cunoștințe a companiei.</li>
          </ul>

          <h2>Scopuri</h2>
          <p>Datele sunt folosite pentru furnizarea serviciului, autentificare, răspunsuri AI, captare de lead-uri, securitate, depanare, analiză operațională și îmbunătățirea produsului.</p>

          <h2>Drepturile GDPR</h2>
          <p>În funcție de situație, persoanele vizate pot solicita acces, rectificare, ștergere, restricționare, opoziție, portabilitate și retragerea consimțământului unde se aplică.</p>

          <h2>Utilizarea AI</h2>
          <p>Nu introduceți în asistentul AI informații sensibile sau inutile pentru scopul conversației. Clienții sunt responsabili să configureze baza de cunoștințe și instrucțiunile astfel încât să respecte legislația aplicabilă.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
