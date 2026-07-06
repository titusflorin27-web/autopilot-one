"use client";

import { authPageCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";
import { LoginForm } from "./LoginForm";

export function LoginPageClient() {
  const copy = authPageCopy.login[useAppLanguage()];

  return (
    <main className="auth-page-shell">
      <section className="auth-hero-panel" aria-label="Autopilot One">
        <div className="auth-brand-pill">Autopilot One</div>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>

        <div className="auth-proof-grid">
          {copy.proofs.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="auth-form-panel">
        <LoginForm />
      </section>
    </main>
  );
}
