const metrics = [
  ["Leads captured", "18"],
  ["Hours saved", "42"],
  ["Events processed", "316"],
  ["AI employees", "3"],
];

const timeline = [
  "Reception AI answered a new customer message.",
  "Sales AI prepared a follow-up task.",
  "CEO AI detected slower response time than usual.",
];

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <h3>Autopilot One</h3>
        <p>Command Center</p>
      </aside>
      <section className="main">
        <div className="eyebrow">Business Timeline</div>
        <h1>Your company is operating.</h1>

        <section className="grid">
          {metrics.map(([label, value]) => (
            <article className="card" key={label}>
              <div className="metric">{value}</div>
              <p>{label}</p>
            </article>
          ))}
        </section>

        <section className="card">
          <h2>Latest events</h2>
          {timeline.map((item) => (
            <p key={item}>✓ {item}</p>
          ))}
        </section>
      </section>
    </main>
  );
}
