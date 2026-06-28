import Link from "next/link";

export function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="brand">Autopilot One</Link>
      <nav>
        <Link href="/pricing">Pricing</Link>
        <Link href="/privacy">Confidențialitate</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Start</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
}
