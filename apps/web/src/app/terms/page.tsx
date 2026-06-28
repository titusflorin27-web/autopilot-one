import { Nav } from "../../components/Nav";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="container page-stack legal-page">
        <section className="card">
          <div className="eyebrow">Termeni</div>
          <h1>Termeni și condiții</h1>
          <p>Acest document este un model operațional pentru pilot și trebuie revizuit juridic înainte de lansarea comercială completă.</p>
        </section>

        <section className="card trust-layout">
          <h2>Furnizor</h2>
          <p>Serviciul este furnizat de [Denumirea societății], CUI [CUI], sediu [Adresă sediu]. Contact: [Email contact] sau contact@autopilot-one.com.</p>

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

          <h2>Disponibilitate</h2>
          <p>Serviciul este furnizat cu efort rezonabil de disponibilitate. Pot exista întreruperi pentru mentenanță, actualizări, furnizori terți sau incidente tehnice.</p>

          <h2>Suspendare</h2>
          <p>Accesul poate fi suspendat în caz de abuz, risc de securitate, neplată sau încălcarea termenilor.</p>
        </section>
      </main>
    </>
  );
}
