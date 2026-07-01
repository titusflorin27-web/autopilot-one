"use client";

import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function DemoRequestForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState("submitting");
    setMessage(null);

    const formData = new FormData(form);

    try {
      const response = await fetch(`${API_URL}/demo-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company") || undefined,
          phone: formData.get("phone") || undefined,
          website: formData.get("website") || undefined,
          message: formData.get("message"),
          source: "demo_page",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Nu am putut trimite cererea demo.");
      }

      form.reset();
      setSubmitState("success");
      setMessage("Cererea a fost trimisă. O găsești în CRM și revenim cu următorul pas cât mai rapid.");
    } catch (caughtError) {
      setSubmitState("error");
      setMessage(caughtError instanceof Error ? caughtError.message : "Nu am putut trimite cererea demo.");
    }
  }

  return (
    <form className="card form-section" onSubmit={onSubmit}>
      <div className="eyebrow">Start pilot</div>
      <h2>Cere demo</h2>
      <p>Spune-ne ce afacere ai și ce conversații vrei să preia primul angajat AI. Cererea ajunge direct în CRM.</p>

      {submitState === "error" && message ? <p className="form-error">{message}</p> : null}
      {submitState === "success" && message ? <p className="form-success">{message}</p> : null}

      <label className="field-label">Nume</label>
      <input name="name" required minLength={2} maxLength={120} placeholder="Nume complet" autoComplete="name" />

      <label className="field-label">Email</label>
      <input name="email" required type="email" maxLength={180} placeholder="nume@companie.ro" autoComplete="email" />

      <label className="field-label">Companie</label>
      <input name="company" maxLength={160} placeholder="Numele companiei" autoComplete="organization" />

      <label className="field-label">Telefon</label>
      <input name="phone" maxLength={60} placeholder="Opțional" autoComplete="tel" />

      <label className="field-label">Website</label>
      <input name="website" maxLength={240} placeholder="https://companie.ro" inputMode="url" />

      <label className="field-label">Ce vrei să automatizezi?</label>
      <textarea name="message" required minLength={10} maxLength={2000} placeholder="Ex: vreau un AI care răspunde la întrebări despre servicii, captează date de contact și trimite lead-urile către echipă." />

      <button className="button" type="submit" disabled={submitState === "submitting"}>
        {submitState === "submitting" ? "Se trimite..." : "Trimite cererea"}
      </button>
    </form>
  );
}
