"use client";

import { useEffect, useState } from "react";
import { authPageCopy, detectBrowserLanguage, subscribeToLanguageChanges, type AppLanguage } from "../../lib/i18n";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const [language, setLanguage] = useState<AppLanguage>("en");
  const copy = authPageCopy.login[language];

  useEffect(() => {
    setLanguage(detectBrowserLanguage());
    return subscribeToLanguageChanges(setLanguage);
  }, []);

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
