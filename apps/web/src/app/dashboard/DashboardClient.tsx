"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const metrics = [
  ["Clienți potențiali captați", "18"],
  ["Ore economisite", "42"],
  ["Evenimente procesate", "316"],
  ["Angajați cu inteligență artificială", "3"],
];

const timeline = [
  "Recepția AI a răspuns la un mesaj nou al unui client.",
  "AI-ul de vânzări a pregătit o sarcină ulterioară.",
  "AI-ul CEO a detectat un timp de răspuns mai lent decât de obicei.",
];

type CurrentUser = {
  email: string;
  memberships: Array<{
    role: string;
    organization: {
      name: string;
      slug: string;
    };
  }>;
};

export function DashboardClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = window.localStorage.getItem("autopilot.accessToken");

    if (!accessToken) {
      setIsLoading(false);
      setError("Autentifică-te pentru a accesa centrul de comandă.");
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Sesiunea a expirat");
        }

        setUser(data);
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Sesiunea a expirat");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>Se încarcă centrul de comandă...</p>;
  }

  if (error) {
    return (
      <section className="card">
        <h1>Autentificare necesară.</h1>
        <p>{error}</p>
        <Link href="/login" className="button">Mergi la login</Link>
      </section>
    );
  }

  const primaryMembership = user?.memberships[0];

  return (
    <>
      <div className="eyebrow">Cronologie de afaceri</div>
      <h1>Compania dumneavoastră este în funcțiune.</h1>
      <p>
        Conectat ca {user?.email}
        {primaryMembership ? ` · ${primaryMembership.organization.name} · ${primaryMembership.role}` : null}
      </p>

      <section className="grid">
        {metrics.map(([label, value]) => (
          <article className="card" key={label}>
            <div className="metric">{value}</div>
            <p>{label}</p>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Ultimele evenimente</h2>
        {timeline.map((item) => (
          <p key={item}>✓ {item}</p>
        ))}
      </section>
    </>
  );
}
