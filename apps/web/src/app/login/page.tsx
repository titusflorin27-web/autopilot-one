import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="container">
      <section className="form card">
        <h2>Login</h2>
        <p>Local UI placeholder. Real authentication comes in Build #003.</p>
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <Link href="/dashboard" className="button">Continue</Link>
      </section>
    </main>
  );
}
