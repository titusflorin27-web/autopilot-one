import { authPageCopy } from "../../lib/i18n";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  const copy = authPageCopy.register.ro;

  return (
    <main className="auth-page-shell">
      <section className="auth-hero-panel" aria-label="Autopilot One">
        <div className="auth-brand-pill">Autopilot One</div>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>

        <div className="auth-proof-grid">
          {copy.proofs.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="auth-form-panel">
        <RegisterForm />
      </section>
    </main>
  );
}
