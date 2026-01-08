// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";

type Health = { ok: boolean; time?: string; commit?: string; versionTime?: string } | null;

export default function Dashboard() {
  const [health, setHealth] = useState<Health>(null);

  useEffect(() => {
    let alive = true;
    const fetchHealth = async () => {
      try {
        const r = await fetch("/api/health", { cache: "no-store" });
        const j = await r.json();
        if (alive) setHealth({ ok: j?.ok, time: j?.time, commit: j?.commit, versionTime: j?.versionTime });
      } catch {
        if (alive) setHealth({ ok: false });
      }
    };
    fetchHealth();
    const id = setInterval(fetchHealth, 5000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "2fr 3fr" }}>
        <section className="panel">
          <h2>Session</h2>
          <p className="muted">You’re signed in. Keep this page open to watch merges & redeploys roll in.</p>
          <div style={{ marginTop: 12 }}>
            <a className="btn secondary" href="/login">Login</a>{" "}
            <a className="btn secondary" href="/register">Register</a>{" "}
            <a className="btn" href="/ops">Trigger redeploy</a>
          </div>
        </section>

        <section className="panel">
          <h2>Deploy & Health</h2>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "center" }}>
            <span className="badge">{health?.ok ? "OK" : "…checking"}</span>
            <div className="muted">Server time: {health?.time ?? "—"}</div>
            <div />
            <div className="muted">Commit: <code>{health?.commit ?? "—"}</code></div>
            <div />
            <div className="muted">Version time: {health?.versionTime ?? "—"}</div>
          </div>
        </section>
      </div>

      <section className="panel">
        <h2>Recent activity</h2>
        <p className="muted">PRs are auto-merging. Open <a className="btn secondary" href="https://github.com/ryanjoooseph-cmyk/tradehub-app/pulls" target="_blank">GitHub PRs</a> to inspect details.</p>
      </section>

      <div className="grid auto">
        <section className="panel">
          <h2>Clients</h2>
          <p className="muted">No clients yet.</p>
        </section>
        <section className="panel">
          <h2>Invoices</h2>
          <p className="muted">Loading…</p>
        </section>
        <section className="panel">
          <h2>Quotes</h2>
          <p className="muted">No quotes yet.</p>
        </section>
        <section className="panel">
          <h2>Jobs</h2>
          <table>
            <thead><tr><th>Title</th><th>Client</th><th>Status</th><th>Amount</th></tr></thead>
            <tbody><tr><td colSpan={4} className="muted">—</td></tr></tbody>
          </table>
        </section>
        <section className="panel">
          <h2>Payments</h2>
          <table>
            <thead><tr><th>Invoice</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody><tr><td colSpan={3} className="muted">—</td></tr></tbody>
          </table>
        </section>
        <section className="panel">
          <h2>Tenants</h2>
          <p className="muted">No tenants yet. (UI works — DB not created.)</p>
        </section>
      </div>
    </div>
  );
}
