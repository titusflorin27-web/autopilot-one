import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Politica de confidențialitate Autopilot One",
  description:
    "Politica de confidențialitate Autopilot One: date prelucrate, scopuri, drepturi GDPR, AI, billing, cookies și furnizori.",
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
            Această pagină descrie modul în care Autopilot One tratează datele în utilizarea platformei.
            Documentul este actualizat pe măsură ce platforma, furnizorii și configurările comerciale evoluează.
          </p>
        </section>

        <section className="card trust-layout">
          <h2>Operatorul datelor</h2>
          <p>
            Operatorul comercial al serviciului este entitatea indicată în oferta sau contractul acceptat de client.
            Pentru întrebări operaționale poți folosi contact@autopilot-one.com.
          </p>
          <p>
            În funcție de caz, Autopilot One poate acționa ca operator pentru conturi, demo requests și relația comercială,
            respectiv ca persoană împuternicită pentru datele introduse de clienți în platformă despre vizitatorii lor.
          </p>

          <h2>Date care pot fi prelucrate</h2>
          <ul className="check-list">
            <li>date de cont: nume, e-mail, rol, organizație, parolă hashuită și setări de workspace;</li>
            <li>date de demo request: nume, e-mail, telefon, companie, website și mesaj transmis;</li>
            <li>conversații cu vizitatorii, mesaje, sumar lead, scor lead, statusuri și taskuri de follow-up;</li>
            <li>date de widget: website/origin, visitor id, evenimente, user agent, loguri tehnice și date de securitate;</li>
            <li>conținut încărcat în baza de cunoștințe a companiei;</li>
            <li>date de billing: plan, status abonament, identificatori Stripe și evenimente de facturare, dacă Stripe este configurat.</li>
          </ul>

          <h2>Scopuri</h2>
          <ul className="check-list">
            <li>furnizarea serviciului, contului și workspace-ului;</li>
            <li>autentificare, securitate, prevenirea abuzului și depanare;</li>
            <li>răspunsuri AI, conversații, captare lead-uri și follow-up operațional;</li>
            <li>gestionarea demo request-urilor, suportului și comunicărilor comerciale solicitate;</li>
            <li>billing, planuri, limite de utilizare și conformitate contractuală;</li>
            <li>îmbunătățirea produsului pe baza datelor operaționale agregate sau minimizate.</li>
          </ul>

          <h2>AI și conținut generat</h2>
          <p>
            Răspunsurile AI pot fi incomplete sau eronate. Nu introduce informații sensibile sau inutile pentru scopul conversației.
            Clienții sunt responsabili să configureze baza de cunoștințe, widgetul și instrucțiunile AI astfel încât să respecte legislația aplicabilă.
          </p>

          <h2>Furnizori</h2>
          <p>
            Serviciul poate folosi furnizori de infrastructură, email, AI, plăți și hosting. Configurația exactă depinde de mediul comercial activ,
            de opțiunile clientului și de furnizorii activați pe server.
          </p>

          <h2>Cookies și stocare locală</h2>
          <p>
            În prezent nu folosim tracking publicitar sau analytics terț pe interfața publică. Folosim stocare locală pentru autentificare,
            preferința de limbă și demo widget. Detalii sunt disponibile în <Link href="/cookies">Politica de cookies</Link>.
          </p>

          <h2>Păstrarea datelor</h2>
          <p>
            Datele sunt păstrate atât timp cât este necesar pentru furnizarea serviciului, obligații contractuale, securitate, audit,
            soluționarea cererilor sau respectarea obligațiilor legale. Perioadele exacte pot fi stabilite în oferta, contractul sau configurarea aplicabilă clientului.
          </p>

          <h2>Drepturile GDPR</h2>
          <p>
            În funcție de situație, persoanele vizate pot solicita acces, rectificare, ștergere, restricționare, opoziție, portabilitate
            și retragerea consimțământului unde se aplică. Poți trimite cereri la contact@autopilot-one.com.
          </p>

          <h2>Autoritatea de supraveghere</h2>
          <p>
            Persoanele vizate pot depune o plângere la autoritatea de supraveghere competentă dacă apreciază că prelucrarea datelor
            nu respectă legislația aplicabilă.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
