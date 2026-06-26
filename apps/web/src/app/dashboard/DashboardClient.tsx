"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const metrics = [
  ["Leads captured", "18"],
  ["Hours saved", "42"],
  ["Events processed", "316"],
  ["AI employees", "3"],
];

const timeline = [
  "Reception AI answered a new customer message.",
  "Sales AI prepared a follow-up task.",
  "CEO AI detected slower response time than usual.",
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
      setError("Please log in to access your command center.");
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
          throw new Error(data.message ?? "Session expired");
        }

        setUser(data);
      })
      .catch((caughtError) => {
        setError(caughtError instanceof Error ? caughtError.message : "Session expired");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>Loading command center...</p>;
  }

  if (error) {
    return (
      <section className="card">
        <h1>Authentication required.</h1>
        <p>{error}</p>
        <Link href="/login" className="button">Go to login</Link>
      </section>
    );
  }

  const primaryMembership = user?.memberships[0];

  return (
    <>
      <div className="eyebrow">Business Timeline</div>
      <h1>Your company is operating.</h1>
      <p>
        Signed in as {user?.email}
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
        <h2>Latest events</h2>
        {timeline.map((item) => (
          <p key={item}>✓ {item}</p>
        ))}
      </section>
    </>
  );
}
