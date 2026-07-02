import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-page-shell">
      <section className="auth-hero-panel" aria-label="Autopilot One">
        <div className="auth-brand-pill">Autopilot One</div>
        <h1>Creează workspace-ul Autopilot One</h1>
        <p>
          Configurează contul de owner și primul spațiu de lucru pentru compania ta.
          După creare, intri direct în dashboard.
        </p>

        <div className="auth-proof-grid">
          <span>Setup rapid</span>
          <span>Dashboard inclus</span>
          <span>Fără cod</span>
        </div>
      </section>

      <section className="auth-form-panel">
        <RegisterForm />
      </section>
    </main>
  );
}
