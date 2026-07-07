"use client";

import Link from "next/link";
import { shellCopy } from "../lib/i18n";
import { useAppLanguage } from "../lib/useAppLanguage";

export function Nav() {
  const language = useAppLanguage();
  const copy = shellCopy[language];
  const trustLabel = language === "ro" ? "Încredere" : "Trust";

  return (
    <header className="nav">
      <Link href="/" className="brand" aria-label={copy.homeAria}>
        <span className="brand-mark">A1</span>
        <span>Autopilot One</span>
      </Link>
      <nav aria-label={copy.navAria}>
        <Link href="/pricing">{copy.pricing}</Link>
        <Link href="/trust">{trustLabel}</Link>
        <Link href="/demo" className="nav-cta">{copy.demo}</Link>
        <Link href="/login">{copy.login}</Link>
      </nav>
    </header>
  );
}
