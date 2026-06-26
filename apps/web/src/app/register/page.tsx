import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="container">
      <section className="form card">
        <h2>Create account</h2>
        <p>Start by creating your organization. Real authentication comes in Build #003.</p>
        <input placeholder="Work email" />
        <input placeholder="Company name" />
        <Link href="/onboarding" className="button">Create workspace</Link>
      </section>
    </main>
  );
}
