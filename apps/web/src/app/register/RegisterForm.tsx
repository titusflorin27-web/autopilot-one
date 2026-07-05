"use client";

import { FormEvent, useEffect, useState } from "react";
import { authCopy, detectBrowserLanguage, subscribeToLanguageChanges, type AppLanguage } from "../../lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<AppLanguage>(() => detectBrowserLanguage());

  useEffect(() => {
    setLanguage(detectBrowserLanguage());
    return subscribeToLanguageChanges(setLanguage);
  }, []);

  const copy = authCopy[language].register;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          organizationName: formData.get("organizationName"),
          organizationSlug: formData.get("organizationSlug") || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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

      <input name="email" aria-label={copy.emailPlaceholder} placeholder={copy.emailPlaceholder} type="email" autoComplete="email" required />
      <input name="password" aria-label={copy.passwordPlaceholder} placeholder={copy.passwordPlaceholder} type="password" autoComplete="new-password" minLength={8} required />
      <input name="firstName" aria-label={copy.firstNamePlaceholder} placeholder={copy.firstNamePlaceholder} autoComplete="given-name" />
      <input name="lastName" aria-label={copy.lastNamePlaceholder} placeholder={copy.lastNamePlaceholder} autoComplete="family-name" />
      <input name="organizationName" aria-label={copy.organizationNamePlaceholder} placeholder={copy.organizationNamePlaceholder} required />
      <input name="organizationSlug" aria-label={copy.organizationSlugPlaceholder} placeholder={copy.organizationSlugPlaceholder} pattern="[a-z0-9-]+" />

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
