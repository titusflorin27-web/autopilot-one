"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { widgetPagesCopy } from "../../lib/i18n";
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
  const language = useAppLanguage();
  const copy = widgetPagesCopy[language].settings;

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
      throw new Error(copy.loginRequired);
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
      throw new Error(data.message ?? copy.loadSettingsError);
    }

    setSettings(data);
  }

  useEffect(() => {
    const accessToken = getAccessToken();

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

        if (membership) {
          await loadSettings(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : copy.loadSettingsError);
      })
      .finally(() => setIsLoading(false));
  }, [copy.loadSessionError, copy.loadSettingsError, copy.loginRequired]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!primaryMembership) {
      setError(copy.organizationMissing);
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
        throw new Error(data.message ?? copy.saveSettingsError);
      }

      setSettings(data);
      setSuccess(copy.saved);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.saveSettingsError);
    } finally {
      setIsSaving(false);
    }
  }

  async function regenerateToken() {
    setError(null);
    setSuccess(null);

    if (!primaryMembership) {
      setError(copy.organizationMissing);
      return;
    }

    try {
      const response = await apiFetch(`/organizations/${primaryMembership.organization.id}/widget-settings/token`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? copy.regenerateTokenError);
      }

      setSettings(data);
      setSuccess(copy.tokenRegenerated);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.regenerateTokenError);
    }
  }

  async function copySnippet() {
    if (!settings?.installSnippet) {
      return;
    }

    await navigator.clipboard.writeText(settings.installSnippet);
    setSuccess(copy.snippetCopied);
  }

  if (isLoading) {
    return (
      <section className="card protected-loading-card">
        <div className="eyebrow">Se încarcă</div>
        <h1>Setări widget</h1>
        <p>{copy.loading}</p>
        <p className="helper-text">Pregătim configurarea widgetului și tokenul de instalare.</p>
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
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>{settings ? `${copy.workspacePrefix}: ${settings.name}` : copy.noSettings}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}

      {settings ? (
        <section className="grid two-columns">
          <form className="card form-section" onSubmit={onSubmit}>
            <h2>{copy.settingsTitle}</h2>
            <label>
              <input name="widgetEnabled" type="checkbox" defaultChecked={settings.widgetEnabled} /> {copy.enableWidget}
            </label>
            <label className="field-label">{copy.widgetTitleLabel}</label>
            <input name="widgetTitle" defaultValue={settings.widgetTitle} placeholder={copy.widgetTitlePlaceholder} />
            <label className="field-label">{copy.primaryColorLabel}</label>
            <input name="widgetPrimaryColor" defaultValue={settings.widgetPrimaryColor} placeholder="#8ee6c9" />
            <label className="field-label">{copy.positionLabel}</label>
            <select name="widgetPosition" defaultValue={settings.widgetPosition}>
              <option value="RIGHT">{copy.positionRight}</option>
              <option value="LEFT">{copy.positionLeft}</option>
            </select>
            <label className="field-label">{copy.widgetTokenLabel}</label>
            <input
              name="widgetToken"
              type="password"
              autoComplete="new-password"
              defaultValue={settings.widgetToken ?? ""}
              placeholder={copy.widgetTokenPlaceholder}
            />
            {settings.widgetToken ? <p className="helper-text">{copy.currentToken}: {maskSecret(settings.widgetToken)}</p> : null}
            <label className="field-label">{copy.allowedOriginsLabel}</label>
            <textarea name="widgetAllowedOrigins" defaultValue={settings.widgetAllowedOrigins.join("\n")} placeholder="https://example.com\nhttps://www.example.com" />
            <div className="actions">
              <button className="button" type="submit" disabled={isSaving}>{isSaving ? copy.saving : copy.save}</button>
              <button className="button secondary" type="button" onClick={regenerateToken}>{copy.regenerateToken}</button>
            </div>
          </form>

          <article className="card">
            <h2>{copy.productionInstallTitle}</h2>
            <p>{copy.productionInstallDescription}</p>
            <p className="helper-text">{copy.maskedTokenHelper}</p>
            {settings.publicConfigEndpoint ? (
              <p>
                <span>{copy.publicConfig}: </span>
                <code>{settings.publicConfigEndpoint}</code>
              </p>
            ) : null}
            <pre className="code-block">{maskedSnippet}</pre>
            <button className="button" type="button" onClick={copySnippet}>{copy.copySnippet}</button>
          </article>
        </section>
      ) : null}
    </div>
  );
}
