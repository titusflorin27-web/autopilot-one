"use client";

import { BusinessDna } from "@autopilot/shared";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { onboardingCopy } from "../../lib/i18n";
import { useAppLanguage } from "../../lib/useAppLanguage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type Membership = {
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
};

type CurrentUser = {
  email: string;
  memberships: Membership[];
};

const emptyBusinessDna: BusinessDna = {
  summary: "",
  products: [],
  services: [],
  rules: [],
  tone: "",
  faq: [],
  objectives: [],
};

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseTitleDescriptionLines(value: FormDataEntryValue | null) {
  return parseLines(value).map((line) => {
    const [title, ...descriptionParts] = line.split(" - ");

    return {
      title: title.trim(),
      description: descriptionParts.join(" - ").trim() || title.trim(),
    };
  });
}

function parseFaqLines(value: FormDataEntryValue | null, fallbackAnswer: string) {
  return parseLines(value).map((line) => {
    const [question, ...answerParts] = line.split(" ? ");

    return {
      question: question.trim().endsWith("?") ? question.trim() : `${question.trim()}?`,
      answer: answerParts.join(" ? ").trim() || fallbackAnswer,
    };
  });
}

function parseObjectiveLines(value: FormDataEntryValue | null) {
  return parseLines(value).map((line) => {
    const [title, metric, target] = line.split(" | ").map((part) => part.trim());

    return {
      title,
      metric: metric || undefined,
      target: target || undefined,
    };
  });
}

export function BusinessDnaForm() {
  const language = useAppLanguage();
  const copy = onboardingCopy[language];

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [businessDna, setBusinessDna] = useState<BusinessDna>(emptyBusinessDna);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];
  const accessToken = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem("autopilot.accessToken");
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setError(copy.loginRequired);
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? copy.loadSessionError);
        }

        setUser(data);
        const membership = data.memberships?.[0] as Membership | undefined;

        if (!membership) {
          return;
        }

        const dnaResponse = await fetch(`${API_URL}/business-dna/${membership.organization.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const dnaData = await dnaResponse.json();

        if (dnaResponse.ok && dnaData.businessDna) {
          setBusinessDna({ ...emptyBusinessDna, ...dnaData.businessDna });
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : copy.loadBusinessDnaError);
      })
      .finally(() => setIsLoading(false));
  }, [accessToken, copy.loadBusinessDnaError, copy.loadSessionError, copy.loginRequired]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!accessToken || !primaryMembership) {
      setError(copy.validOrganizationRequired);
      return;
    }

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);

    const payload: BusinessDna = {
      summary: String(formData.get("summary") ?? "").trim(),
      products: parseTitleDescriptionLines(formData.get("products")),
      services: parseTitleDescriptionLines(formData.get("services")),
      rules: parseTitleDescriptionLines(formData.get("rules")),
      tone: String(formData.get("tone") ?? "").trim(),
      faq: parseFaqLines(formData.get("faq"), copy.fallbackAnswer),
      objectives: parseObjectiveLines(formData.get("objectives")),
    };

    try {
      const response = await fetch(`${API_URL}/business-dna`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          organizationId: primaryMembership.organization.id,
          businessDna: payload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? copy.saveBusinessDnaError);
      }

      setBusinessDna(payload);
      setMessage(copy.saved);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.saveBusinessDnaError);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="card protected-loading-card">
        <div className="eyebrow">Se încarcă</div>
        <h1>Profil companie</h1>
        <p>{copy.loading}</p>
        <p className="helper-text">Pregătim profilul companiei și regulile operaționale pentru AI.</p>
      </section>
    );
  }

  if (error && !user) {
    return (
      <section className="card">
        <h1>{copy.authTitle}</h1>
        <p>{error}</p>
        <a href="/login" className="button">{copy.loginCta}</a>
      </section>
    );
  }

  return (
    <form className="business-dna-form" onSubmit={onSubmit}>
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>
          {primaryMembership
            ? `${copy.workspacePrefix}: ${primaryMembership.organization.name}`
            : copy.organizationMissing}
        </p>
      </section>

      <section className="card form-section">
        <h2>{copy.summaryTitle}</h2>
        <textarea name="summary" defaultValue={businessDna.summary} placeholder={copy.summaryPlaceholder} required />
      </section>

      <section className="grid two-columns">
        <div className="card form-section">
          <h3>{copy.productsTitle}</h3>
          <p>{copy.productsHelper}</p>
          <textarea name="products" defaultValue={businessDna.products.map((item) => `${item.title} - ${item.description}`).join("\n")} placeholder={copy.productsPlaceholder} />
        </div>
        <div className="card form-section">
          <h3>{copy.servicesTitle}</h3>
          <p>{copy.servicesHelper}</p>
          <textarea name="services" defaultValue={businessDna.services.map((item) => `${item.title} - ${item.description}`).join("\n")} placeholder={copy.servicesPlaceholder} />
        </div>
      </section>

      <section className="grid two-columns">
        <div className="card form-section">
          <h3>{copy.rulesTitle}</h3>
          <p>{copy.rulesHelper}</p>
          <textarea name="rules" defaultValue={businessDna.rules.map((rule) => `${rule.title} - ${rule.description}`).join("\n")} placeholder={copy.rulesPlaceholder} />
        </div>
        <div className="card form-section">
          <h3>{copy.toneTitle}</h3>
          <p>{copy.toneHelper}</p>
          <textarea name="tone" defaultValue={businessDna.tone} placeholder={copy.tonePlaceholder} required />
        </div>
      </section>

      <section className="grid two-columns">
        <div className="card form-section">
          <h3>{copy.faqTitle}</h3>
          <p>{copy.faqHelper}</p>
          <textarea name="faq" defaultValue={businessDna.faq.map((item) => `${item.question} ? ${item.answer}`).join("\n")} placeholder={copy.faqPlaceholder} />
        </div>
        <div className="card form-section">
          <h3>{copy.objectivesTitle}</h3>
          <p>{copy.objectivesHelper}</p>
          <textarea name="objectives" defaultValue={businessDna.objectives.map((item) => [item.title, item.metric, item.target].filter(Boolean).join(" | ")).join("\n")} placeholder={copy.objectivesPlaceholder} />
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <div className="actions">
        <button className="button" type="submit" disabled={isSaving || !primaryMembership}>
          {isSaving ? copy.saving : copy.save}
        </button>
        <a href="/dashboard" className="button secondary">{copy.backToDashboard}</a>
      </div>
    </form>
  );
}
