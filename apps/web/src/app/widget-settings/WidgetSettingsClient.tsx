"use client";

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

type WidgetSettings = {
  id: string;
  name: string;
  slug: string;
  widgetEnabled: boolean;
  widgetTitle: string;
  widgetPrimaryColor: string;
  widgetPosition: "LEFT" | "RIGHT";
  widgetToken?: string | null;
  widgetAllowedOrigins: string[];
  publicConfigEndpoint?: string;
  installSnippet: string;
};

function maskSecret(value?: string | null) {
  if (!value) {
    return "";
  }

  if (value.length <= 12) {
    return "••••••••";
  }

  return `${value.slice(0, 7)}••••••••••••${value.slice(-5)}`;
}

function maskSnippet(snippet: string) {
  return snippet.replace(/data-widget-token="[^"]*"/g, 'data-widget-token="••••••••••••••••"');
}

export function WidgetSettingsClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];
  const maskedSnippet = useMemo(() => settings ? maskSnippet(settings.installSnippet) : "", [settings]);

  function getAccessToken() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function apiFetch(path: string, init: RequestInit = {}) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("Autentifică-te înainte să gestionezi setările widgetului.");
    }

    return fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  }

  async function loadSettings(organizationId: string) {
    const response = await apiFetch(`/organizations/${organizationId}/widget-settings`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Nu am putut încărca setările widgetului");
    }

    setSettings(data);
  }

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("Autentifică-te înainte să gestionezi setările widgetului.");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Nu am putut încărca sesiunea utilizatorului");
        }

        setUser(data);
        const membership = data.memberships?.[0] as Membership | undefined;

        if (membership) {
          await loadSettings(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Nu am putut încărca setările widgetului");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!primaryMembership) {
      setError("Nu există organizație pentru acest cont.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiFetch(`/organizations/${primaryMembership.organization.id}/widget-settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetEnabled: formData.get("widgetEnabled") === "on",
          widgetTitle: formData.get("widgetTitle"),
          widgetPrimaryColor: formData.get("widgetPrimaryColor"),
          widgetPosition: formData.get("widgetPosition"),
          widgetToken: formData.get("widgetToken") || undefined,
          widgetAllowedOrigins: String(formData.get("widgetAllowedOrigins") ?? "")
            .split("\n")
            .map((origin) => origin.trim())
            .filter(Boolean),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Nu am putut salva setările widgetului");
      }

      setSettings(data);
      setSuccess("Setările widgetului au fost salvate.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Nu am putut salva setările widgetului");
    } finally {
      setIsSaving(false);
    }
  }

  async function regenerateToken() {
    setError(null);
    setSuccess(null);

    if (!primaryMembership) {
      setError("Nu există organizație pentru acest cont.");
      return;
    }

    try {
      const response = await apiFetch(`/organizations/${primaryMembership.organization.id}/widget-settings/token`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Nu am putut regenera jetonul");
      }

      setSettings(data);
      setSuccess("Jetonul widgetului a fost regenerat. Copiază din nou fragmentul de instalare.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Nu am putut regenera jetonul");
    }
  }

  async function copySnippet() {
    if (!settings?.installSnippet) {
      return;
    }

    await navigator.clipboard.writeText(settings.installSnippet);
    setSuccess("Fragmentul de instalare a fost copiat. Conține jetonul real, chiar dacă pe ecran este mascat.");
  }

  if (isLoading) {
    return <p>Se încarcă setările widgetului...</p>;
  }

  if (error && !user) {
    return (
      <section className="card">
        <h1>Autentificare necesară.</h1>
        <p>{error}</p>
        <a href="/login" className="button">Mergi la login</a>
      </section>
    );
  }

  return (
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">Setări widget</div>
        <h1>Controlează instalarea widgetului.</h1>
        <p>{settings ? `Spațiu de lucru: ${settings.name}` : "Nu există setări încărcate."}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}

      {settings ? (
        <section className="grid two-columns">
          <form className="card form-section" onSubmit={onSubmit}>
            <h2>Setări widget</h2>
            <label>
              <input name="widgetEnabled" type="checkbox" defaultChecked={settings.widgetEnabled} /> Activează widgetul
            </label>
            <label className="field-label">Titlu widget</label>
            <input name="widgetTitle" defaultValue={settings.widgetTitle} placeholder="Titlu widget" />
            <label className="field-label">Culoare principală</label>
            <input name="widgetPrimaryColor" defaultValue={settings.widgetPrimaryColor} placeholder="#8ee6c9" />
            <label className="field-label">Poziție widget</label>
            <select name="widgetPosition" defaultValue={settings.widgetPosition}>
              <option value="RIGHT">Dreapta</option>
              <option value="LEFT">Stânga</option>
            </select>
            <label className="field-label">Jeton widget</label>
            <input
              name="widgetToken"
              type="password"
              autoComplete="new-password"
              defaultValue={settings.widgetToken ?? ""}
              placeholder="Jeton widget"
            />
            {settings.widgetToken ? <p className="helper-text">Jeton curent: {maskSecret(settings.widgetToken)}</p> : null}
            <label className="field-label">Domenii permise</label>
            <textarea name="widgetAllowedOrigins" defaultValue={settings.widgetAllowedOrigins.join("\n")} placeholder="https://example.com\nhttps://www.example.com" />
            <div className="actions">
              <button className="button" type="submit" disabled={isSaving}>{isSaving ? "Se salvează..." : "Salvează setările"}</button>
              <button className="button secondary" type="button" onClick={regenerateToken}>Regenerează jetonul</button>
            </div>
          </form>

          <article className="card">
            <h2>Instalare în producție</h2>
            <p>Widgetul încarcă configurația live înainte de randare.</p>
            <p className="helper-text">Jetonul este mascat pentru siguranță. Fragmentul copiat conține jetonul real.</p>
            {settings.publicConfigEndpoint ? (
              <p>
                <span>Configurație publică: </span>
                <code>{settings.publicConfigEndpoint}</code>
              </p>
            ) : null}
            <pre className="code-block">{maskedSnippet}</pre>
            <button className="button" type="button" onClick={copySnippet}>Copiază fragmentul</button>
          </article>
        </section>
      ) : null}
    </div>
  );
}
