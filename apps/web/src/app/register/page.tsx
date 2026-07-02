"use client";

import { useEffect, useState } from "react";
import { authPageCopy, detectBrowserLanguage, subscribeToLanguageChanges, type AppLanguage } from "../../lib/i18n";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  const [language, setLanguage] = useState<AppLanguage>("en");
  const copy = authPageCopy.register[language];

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
        <RegisterForm />
      </section>
    </main>
  );
}
