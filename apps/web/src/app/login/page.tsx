import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-page-shell">
      <section className="auth-hero-panel" aria-label="Autopilot One">
        <div className="auth-brand-pill">Autopilot One</div>
        <h1>Intră în centrul tău de comandă AI</h1>
        <p>
          Urmărește leadurile, mesajele și activitatea widgetului dintr-un spațiu simplu,
          creat pentru IMM-uri care vor răspuns rapid și organizare.
        </p>

        <div className="auth-proof-grid">
          <span>AI Receptionist 24/7</span>
          <span>CRM Lite inclus</span>
          <span>Acces securizat</span>
        </div>
      </section>

      <section className="auth-form-panel">
        <LoginForm />
      </section>
    </main>
  );
}
