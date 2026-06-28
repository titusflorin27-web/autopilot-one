import Link from "next/link";

const productLinks = [
  { href: "/", label: "Acasă" },
  { href: "/pricing", label: "Prețuri" },
  { href: "/demo", label: "Cere demo" },
  { href: "/login", label: "Intră în cont" },
];

const legalLinks = [
  { href: "/privacy", label: "Confidențialitate" },
  { href: "/terms", label: "Termeni" },
  { href: "/refund-policy", label: "Rambursări" },
  { href: "/consumer-rights", label: "Consumatori" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <Link href="/" className="brand">Autopilot One</Link>
          <p>Angajați AI pentru IMM-uri: recepție web, captare lead-uri, urmărire în dashboard și CRM Lite pentru cererile demo.</p>
          <p className="helper-text">Pilot activ. Pentru ofertă comercială sau configurare, folosește formularul de demo.</p>
        </section>

        <section>
          <h3>Produs</h3>
          <div className="footer-links-column">
            {productLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </div>
        </section>

        <section>
          <h3>Legal</h3>
          <div className="footer-links-column">
            {legalLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </div>
        </section>

        <section>
          <h3>Contact</h3>
          <p>contact@autopilot-one.com</p>
          <p className="helper-text">Răspunsurile AI trebuie configurate și verificate pentru fiecare afacere înainte de folosirea cu clienți reali.</p>
        </section>
      </div>
    </footer>
  );
}
