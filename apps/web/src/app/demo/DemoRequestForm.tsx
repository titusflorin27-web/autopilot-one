"use client";

import { FormEvent, useState } from "react";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type SubmitState = "idle" | "submitting" | "success" | "error";

const demoFormCopy = {
  ro: {
    eyebrow: "Start implementare",
    title: "Cere demo",
    body: "Spune-ne ce afacere ai și ce conversații vrei să preia primul angajat AI. Cererea ajunge direct în CRM.",
    genericError: "Nu am putut trimite cererea demo.",
    success: "Cererea a fost trimisă. O găsești în CRM și revenim cu următorul pas cât mai rapid.",
    name: "Nume",
    namePlaceholder: "Nume complet",
    email: "Email",
    emailPlaceholder: "nume@companie.ro",
    company: "Companie",
    companyPlaceholder: "Numele companiei",
    phone: "Telefon",
    optionalPlaceholder: "Opțional",
    website: "Website",
    websitePlaceholder: "https://companie.ro",
    message: "Ce vrei să automatizezi?",
    messagePlaceholder: "Ex: vreau un AI care răspunde la întrebări despre servicii, captează date de contact și trimite lead-urile către echipă.",
    submitting: "Se trimite...",
    submit: "Trimite cererea",
  },
  en: {
    eyebrow: "Start implementation",
    title: "Request demo",
    body: "Tell us what business you run and which conversations you want the first AI employee to handle. The request goes directly into the CRM.",
    genericError: "Could not send the demo request.",
    success: "The request was sent. You can find it in the CRM and we will come back with the next step as soon as possible.",
    name: "Name",
    namePlaceholder: "Full name",
    email: "Email",
    emailPlaceholder: "name@company.com",
    company: "Company",
    companyPlaceholder: "Company name",
    phone: "Phone",
    optionalPlaceholder: "Optional",
    website: "Website",
    websitePlaceholder: "https://company.com",
    message: "What do you want to automate?",
    messagePlaceholder: "Example: I want an AI that answers service questions, captures contact details and sends leads to the team.",
    submitting: "Sending...",
    submit: "Send request",
  },
} as const;

export function DemoRequestForm() {
  const copy = demoFormCopy[useAppLanguage()];
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
        throw new Error(data.message ?? copy.genericError);
      }

      form.reset();
      setSubmitState("success");
      setMessage(copy.success);
    } catch (caughtError) {
      setSubmitState("error");
      setMessage(caughtError instanceof Error ? caughtError.message : copy.genericError);
    }
  }

  return (
    <form className="card form-section" onSubmit={onSubmit}>
      <div className="eyebrow">{copy.eyebrow}</div>
      <h2>{copy.title}</h2>
      <p>{copy.body}</p>

      {submitState === "error" && message ? <p className="form-error">{message}</p> : null}
      {submitState === "success" && message ? <p className="form-success">{message}</p> : null}

      <label className="field-label" htmlFor="demo-name">{copy.name}</label>
      <input id="demo-name" name="name" required minLength={2} maxLength={120} placeholder={copy.namePlaceholder} autoComplete="name" />

      <label className="field-label" htmlFor="demo-email">{copy.email}</label>
      <input id="demo-email" name="email" required type="email" maxLength={180} placeholder={copy.emailPlaceholder} autoComplete="email" />

      <label className="field-label" htmlFor="demo-company">{copy.company}</label>
      <input id="demo-company" name="company" maxLength={160} placeholder={copy.companyPlaceholder} autoComplete="organization" />

      <label className="field-label" htmlFor="demo-phone">{copy.phone}</label>
      <input id="demo-phone" name="phone" maxLength={60} placeholder={copy.optionalPlaceholder} autoComplete="tel" />

      <label className="field-label" htmlFor="demo-website">{copy.website}</label>
      <input id="demo-website" name="website" maxLength={240} placeholder={copy.websitePlaceholder} inputMode="url" />

      <label className="field-label" htmlFor="demo-message">{copy.message}</label>
      <textarea id="demo-message" name="message" required minLength={10} maxLength={2000} placeholder={copy.messagePlaceholder} />

      <button className="button" type="submit" disabled={submitState === "submitting"}>
        {submitState === "submitting" ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
