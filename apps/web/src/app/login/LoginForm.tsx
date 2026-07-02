"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { authCopy, detectBrowserLanguage, subscribeToLanguageChanges, type AppLanguage } from "../../lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<AppLanguage>(() => detectBrowserLanguage());

  useEffect(() => {
    setLanguage(detectBrowserLanguage());
    return subscribeToLanguageChanges(setLanguage);
  }, []);

  const copy = authCopy[language].login;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? copy.error);
      }

      window.localStorage.setItem("autopilot.accessToken", data.accessToken);
      window.localStorage.setItem("autopilot.refreshToken", data.refreshToken);
      window.location.href = "/dashboard";
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form card auth-card" onSubmit={onSubmit}>
      <div className="eyebrow">{copy.eyebrow}</div>
      <h2>{copy.title}</h2>
      <p>{copy.subtitle}</p>

      <input name="email" placeholder={copy.emailPlaceholder} type="email" autoComplete="email" required />
      <input name="password" placeholder={copy.passwordPlaceholder} type="password" autoComplete="current-password" minLength={8} required />

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? copy.submitting : copy.submit}
      </button>

      <p className="auth-switch">
        {copy.switchPrefix} <Link href="/register">{copy.switchLink}</Link>.
      </p>
    </form>
  );
}
