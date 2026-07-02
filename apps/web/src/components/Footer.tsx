"use client";

import Link from "next/link";
import { shellCopy } from "../lib/i18n";
import { useAppLanguage } from "../lib/useAppLanguage";

export function Footer() {
  const copy = shellCopy[useAppLanguage()];

  const productLinks = [
    { href: "/", label: copy.home },
    { href: "/pricing", label: copy.pricing },
    { href: "/demo", label: copy.demo },
    { href: "/widget-demo", label: copy.widgetDemo },
    { href: "/login", label: copy.login },
  ];

  const legalLinks = [
    { href: "/privacy", label: copy.privacy },
    { href: "/terms", label: copy.terms },
    { href: "/refund-policy", label: copy.refunds },
    { href: "/consumer-rights", label: copy.consumers },
  ];

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <Link href="/" className="brand">
            <span className="brand-mark">A1</span>
            <span>Autopilot One</span>
          </Link>
          <p>{copy.footerDescription}</p>
          <p className="helper-text">{copy.footerPilot}</p>
        </section>

        <section>
          <h3>{copy.product}</h3>
          <div className="footer-links-column">
            {productLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </div>
        </section>

        <section>
          <h3>{copy.legal}</h3>
          <div className="footer-links-column">
            {legalLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </div>
        </section>

        <section>
          <h3>{copy.contact}</h3>
          <p>contact@autopilot-one.com</p>
          <p className="helper-text">{copy.contactNote}</p>
        </section>
      </div>
    </footer>
  );
}
