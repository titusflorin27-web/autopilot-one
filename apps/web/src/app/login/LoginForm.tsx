"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        throw new Error(data.message ?? "Login failed");
      }

      window.localStorage.setItem("autopilot.accessToken", data.accessToken);
      window.localStorage.setItem("autopilot.refreshToken", data.refreshToken);
      window.location.href = "/dashboard";
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form card" onSubmit={onSubmit}>
      <div className="eyebrow">Secure access</div>
      <h2>Login</h2>
      <p>Use your owner or team account to access the command center.</p>

      <input name="email" placeholder="Email" type="email" autoComplete="email" required />
      <input name="password" placeholder="Password" type="password" autoComplete="current-password" minLength={8} required />

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Continue"}
      </button>

      <p className="auth-switch">
        New to Autopilot One? <Link href="/register">Create an account</Link>.
      </p>
    </form>
  );
}
