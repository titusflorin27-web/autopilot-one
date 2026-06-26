import Link from "next/link";
import { Nav } from "../components/Nav";

const employees = [
  ["Reception AI", "Answers customers, captures leads and escalates only exceptions."],
  ["Sales AI", "Qualifies opportunities, sends follow-ups and prepares offers."],
  ["CEO AI", "Reads the business timeline and recommends the next best actions."],
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="container">
        <section className="hero">
          <div className="eyebrow">AI Employees for SMBs</div>
          <h1>Run your business on autopilot.</h1>
          <p>
            Autopilot One is an AI-native operating system that coordinates your business
            memory, events, workflows and AI employees from one command center.
          </p>
          <div className="actions">
            <Link href="/register" className="button">Start building</Link>
            <Link href="/dashboard" className="button secondary">View dashboard</Link>
          </div>
        </section>

        <section className="grid">
          {employees.map(([title, description]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="card">
          <h2>Everything is an event.</h2>
          <p>
            Customer messages, new leads, accepted offers and payments become business events.
            AI employees listen, decide and execute workflows with full auditability.
          </p>
        </section>
      </main>
    </>
  );
}
