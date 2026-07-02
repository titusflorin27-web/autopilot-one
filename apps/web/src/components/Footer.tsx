import Link from "next/link";

const productLinks = [
  { href: "/", label: "Acasă" },
  { href: "/pricing", label: "Prețuri" },
  { href: "/demo", label: "Cere demo" },
  { href: "/widget-demo", label: "Demo widget" },
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
          <Link href="/" className="brand">
            <span className="brand-mark">A1</span>
            <span>Autopilot One</span>
          </Link>
          <p>Platformă AI pentru IMM-uri care vor să răspundă rapid, să capteze lead-uri și să urmărească cererile într-un flux operațional clar.</p>
          <p className="helper-text">Pilot controlat. Configurare ghidată, date urmărite în CRM Lite și validare înainte de folosirea cu clienți reali.</p>
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
          <p className="helper-text">Pentru demo, pilot sau ofertă, trimite o cerere și îți propunem primul flux AI potrivit pentru afacerea ta.</p>
        </section>
      </div>
    </footer>
  );
}
