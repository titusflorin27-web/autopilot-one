"use client";

import { BusinessDna } from "@autopilot/shared";
import { FormEvent, useEffect, useMemo, useState } from "react";

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

function parseFaqLines(value: FormDataEntryValue | null) {
  return parseLines(value).map((line) => {
    const [question, ...answerParts] = line.split(" ? ");

    return {
      question: question.trim().endsWith("?") ? question.trim() : `${question.trim()}?`,
      answer: answerParts.join(" ? ").trim() || "To be defined.",
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
      setError("Please log in before creating Business DNA.");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Could not load user session");
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
        setError(caughtError instanceof Error ? caughtError.message : "Could not load Business DNA");
      })
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!accessToken || !primaryMembership) {
      setError("A valid organization session is required.");
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
      faq: parseFaqLines(formData.get("faq")),
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
        throw new Error(data.message ?? "Could not save Business DNA");
      }

      setBusinessDna(payload);
      setMessage("Business DNA saved. Reception AI will use this as company context in BUILD #006.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not save Business DNA");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p>Loading Business DNA...</p>;
  }

  if (error && !user) {
    return (
      <section className="card">
        <h1>Authentication required.</h1>
        <p>{error}</p>
        <a href="/login" className="button">Go to login</a>
      </section>
    );
  }

  return (
    <form className="business-dna-form" onSubmit={onSubmit}>
      <section className="card">
        <div className="eyebrow">BUILD #004 Business DNA</div>
        <h1>Describe your business once.</h1>
        <p>
          {primaryMembership
            ? `Workspace: ${primaryMembership.organization.name}`
            : "No organization found for this account."}
        </p>
      </section>

      <section className="card form-section">
        <h2>Company summary</h2>
        <textarea name="summary" defaultValue={businessDna.summary} placeholder="What does the company do, who does it serve, and what makes it different?" required />
      </section>

      <section className="grid two-columns">
        <div className="card form-section">
          <h3>Products</h3>
          <p>One per line: Product - description</p>
          <textarea name="products" defaultValue={businessDna.products.map((item) => `${item.title} - ${item.description}`).join("\n")} placeholder="Starter Plan - For small teams getting started" />
        </div>
        <div className="card form-section">
          <h3>Services</h3>
          <p>One per line: Service - description</p>
          <textarea name="services" defaultValue={businessDna.services.map((item) => `${item.title} - ${item.description}`).join("\n")} placeholder="Implementation - Setup and onboarding support" />
        </div>
      </section>

      <section className="grid two-columns">
        <div className="card form-section">
          <h3>Rules</h3>
          <p>One per line: Rule - explanation</p>
          <textarea name="rules" defaultValue={businessDna.rules.map((rule) => `${rule.title} - ${rule.description}`).join("\n")} placeholder="Refunds - Escalate refund requests to a human" />
        </div>
        <div className="card form-section">
          <h3>Tone</h3>
          <p>How should AI Employees communicate?</p>
          <textarea name="tone" defaultValue={businessDna.tone} placeholder="Professional, warm, concise, confident." required />
        </div>
      </section>

      <section className="grid two-columns">
        <div className="card form-section">
          <h3>FAQ</h3>
          <p>One per line: Question ? Answer</p>
          <textarea name="faq" defaultValue={businessDna.faq.map((item) => `${item.question} ? ${item.answer}`).join("\n")} placeholder="How fast do you respond? ? Usually within one business day." />
        </div>
        <div className="card form-section">
          <h3>Objectives</h3>
          <p>One per line: Objective | metric | target</p>
          <textarea name="objectives" defaultValue={businessDna.objectives.map((item) => [item.title, item.metric, item.target].filter(Boolean).join(" | ")).join("\n")} placeholder="Increase qualified leads | leads/month | 100" />
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <div className="actions">
        <button className="button" type="submit" disabled={isSaving || !primaryMembership}>
          {isSaving ? "Saving..." : "Save Business DNA"}
        </button>
        <a href="/dashboard" className="button secondary">Back to dashboard</a>
      </div>
    </form>
  );
}
