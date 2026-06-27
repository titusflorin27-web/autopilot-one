"use client";

import { FormEvent, useEffect, useState } from "react";

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

export function WidgetSettingsClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const primaryMembership = user?.memberships[0];

  function getAccessToken() {
    return window.localStorage.getItem("autopilot.accessToken");
  }

  async function apiFetch(path: string, init: RequestInit = {}) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("Please log in before managing widget settings.");
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
      throw new Error(data.message ?? "Could not load widget settings");
    }

    setSettings(data);
  }

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("Please log in before managing widget settings.");
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

        if (membership) {
          await loadSettings(membership.organization.id);
        }
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Could not load widget settings");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!primaryMembership) {
      setError("No organization found for this account.");
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
        throw new Error(data.message ?? "Could not save widget settings");
      }

      setSettings(data);
      setSuccess("Widget settings saved.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not save widget settings");
    } finally {
      setIsSaving(false);
    }
  }

  async function regenerateToken() {
    setError(null);
    setSuccess(null);

    if (!primaryMembership) {
      setError("No organization found for this account.");
      return;
    }

    try {
      const response = await apiFetch(`/organizations/${primaryMembership.organization.id}/widget-settings/token`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Could not regenerate token");
      }

      setSettings(data);
      setSuccess("Widget token regenerated.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not regenerate token");
    }
  }

  async function copySnippet() {
    if (!settings?.installSnippet) {
      return;
    }

    await navigator.clipboard.writeText(settings.installSnippet);
    setSuccess("Install snippet copied.");
  }

  if (isLoading) {
    return <p>Loading widget settings...</p>;
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
    <div className="widget-demo-layout">
      <section className="card">
        <div className="eyebrow">BUILD #013 Widget Runtime Enforcement</div>
        <h1>Manage widget runtime.</h1>
        <p>{settings ? `Workspace: ${settings.name}` : "No widget settings loaded."}</p>
      </section>

      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}

      {settings ? (
        <section className="grid two-columns">
          <form className="card form-section" onSubmit={onSubmit}>
            <h2>Widget settings</h2>
            <label>
              <input name="widgetEnabled" type="checkbox" defaultChecked={settings.widgetEnabled} /> Enable widget
            </label>
            <input name="widgetTitle" defaultValue={settings.widgetTitle} placeholder="Widget title" />
            <input name="widgetPrimaryColor" defaultValue={settings.widgetPrimaryColor} placeholder="#8ee6c9" />
            <select name="widgetPosition" defaultValue={settings.widgetPosition}>
              <option value="RIGHT">Right</option>
              <option value="LEFT">Left</option>
            </select>
            <input name="widgetToken" defaultValue={settings.widgetToken ?? ""} placeholder="Widget token, optional" />
            <textarea name="widgetAllowedOrigins" defaultValue={settings.widgetAllowedOrigins.join("\n")} placeholder="https://example.com\nhttps://www.example.com" />
            <div className="actions">
              <button className="button" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save settings"}</button>
              <button className="button secondary" type="button" onClick={regenerateToken}>Regenerate token</button>
            </div>
          </form>

          <article className="card">
            <h2>Runtime install</h2>
            <p>The widget now loads live configuration before rendering.</p>
            {settings.publicConfigEndpoint ? <p>Public config: <code>{settings.publicConfigEndpoint}</code></p> : null}
            <pre className="code-block">{settings.installSnippet}</pre>
            <button className="button" type="button" onClick={copySnippet}>Copy snippet</button>
          </article>
        </section>
      ) : null}
    </div>
  );
}
