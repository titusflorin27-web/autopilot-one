import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="container">
      <section className="form card">
        <div className="eyebrow">Business DNA</div>
        <h2>Describe your business once.</h2>
        <p>Autopilot One will use this as the source of truth for AI employees.</p>
        <input placeholder="Website URL" />
        <input placeholder="Industry" />
        <input placeholder="Primary language" />
        <Link href="/dashboard" className="button">Generate Business DNA</Link>
      </section>
    </main>
  );
}
