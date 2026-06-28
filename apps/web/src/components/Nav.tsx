import Link from "next/link";

export function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="brand">Autopilot One</Link>
      <nav>
        <Link href="/pricing">Prețuri</Link>
        <Link href="/demo" className="nav-cta">Cere demo</Link>
        <Link href="/privacy">Confidențialitate</Link>
        <Link href="/login">Intră în cont</Link>
      </nav>
    </header>
  );
}
