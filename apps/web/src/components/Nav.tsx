import Link from "next/link";

export function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="brand" aria-label="Autopilot One home">
        <span className="brand-mark">A1</span>
        <span>Autopilot One</span>
      </Link>
      <nav aria-label="Navigație principală">
        <Link href="/pricing">Prețuri</Link>
        <Link href="/demo">Cere demo</Link>
        <Link href="/register" className="nav-cta">Creează cont</Link>
        <Link href="/login">Intră în cont</Link>
      </nav>
    </header>
  );
}
