"use client";

import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        throw new Error(data.message ?? "Registration failed");
      }

      window.localStorage.setItem("autopilot.accessToken", data.accessToken);
      window.localStorage.setItem("autopilot.refreshToken", data.refreshToken);
      window.location.href = "/dashboard";
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form card" onSubmit={onSubmit}>
      <div className="eyebrow">Build #003 Identity</div>
      <h2>Create account</h2>
      <p>Create the owner account and first organization workspace.</p>

      <input name="email" placeholder="Work email" type="email" autoComplete="email" required />
      <input name="password" placeholder="Password" type="password" autoComplete="new-password" minLength={8} required />
      <input name="firstName" placeholder="First name" autoComplete="given-name" />
      <input name="lastName" placeholder="Last name" autoComplete="family-name" />
      <input name="organizationName" placeholder="Company name" required />
      <input name="organizationSlug" placeholder="company-slug" pattern="[a-z0-9-]+" />

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create workspace"}
      </button>
    </form>
  );
}
