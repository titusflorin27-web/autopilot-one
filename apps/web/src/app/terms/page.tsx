import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Termeni și condiții Autopilot One",
  description:
    "Termenii operaționali Autopilot One: acces, conturi, utilizare acceptabilă, date, AI și disponibilitate.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack legal-page">
        <section className="card">
          <div className="eyebrow">Termeni</div>
          <h1>Termeni și condiții</h1>
          <p>Acest document descrie cadrul operațional de utilizare a platformei Autopilot One și poate fi completat de oferta sau contractul acceptat de client.</p>
        </section>

        <section className="card trust-layout">
          <h2>Furnizor</h2>
          <p>Serviciul este furnizat de entitatea comercială indicată în oferta sau contractul acceptat de client. Contact operațional: contact@autopilot-one.com.</p>

          <h2>Serviciul</h2>
          <p>Autopilot One oferă instrumente software pentru widget web, bază de cunoștințe, conversații asistate de AI, captare lead-uri și management operațional.</p>

          <h2>Acces și conturi</h2>
          <p>Clientul este responsabil pentru securitatea contului, utilizarea parolelor sigure și acordarea accesului doar persoanelor autorizate.</p>

          <h2>Utilizare acceptabilă</h2>
          <p>Este interzisă utilizarea serviciului pentru conținut ilegal, abuziv, fraudulos, spam, încălcarea drepturilor altor persoane sau încercări de acces neautorizat.</p>

          <h2>Limitări AI</h2>
          <p>Răspunsurile generate de AI pot fi incomplete sau eronate. Clientul rămâne responsabil pentru verificarea informațiilor comerciale, juridice, medicale, financiare sau de altă natură sensibilă.</p>

          <h2>Date și conținut</h2>
          <p>Clientul este responsabil pentru datele încărcate în platformă și pentru instrucțiunile oferite asistentului AI. Nu trebuie încărcate date inutile sau informații sensibile fără temei legal.</p>

          <h2>Protecția datelor</h2>
          <p>Clientul trebuie să informeze vizitatorii și utilizatorii finali despre utilizarea widgetului, AI-ului și captării de lead-uri. Pentru datele vizitatorilor introduse în platformă, clientul poate acționa ca operator, iar Autopilot One poate acționa ca persoană împuternicită, conform ofertei sau contractului aplicabil.</p>

          <h2>Cookies și tehnologii similare</h2>
          <p>Interfața publică nu folosește în prezent tracking publicitar sau analytics terț. Dacă vor fi adăugate tehnologii opționale, acestea vor fi tratate conform politicii de cookies și legislației aplicabile.</p>

          <h2>Disponibilitate</h2>
          <p>Serviciul este furnizat cu efort rezonabil de disponibilitate. Pot exista întreruperi pentru mentenanță, actualizări, furnizori terți sau incidente tehnice.</p>

          <h2>Suspendare</h2>
          <p>Accesul poate fi suspendat în caz de abuz, risc de securitate, neplată sau încălcarea termenilor.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
