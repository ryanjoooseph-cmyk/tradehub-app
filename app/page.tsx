import Link from "next/link";

export default function Page() {
  const links = [
    { label: "Dashboard", href: "/dashboard", sub: "Overview and activity" },
    { label: "Clients", href: "/clients", sub: "Manage customers" },
    { label: "Jobs", href: "/jobs", sub: "Active & scheduled work" },
    { label: "Quotes", href: "/quotes", sub: "Drafts & approvals" },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome to TradeHub</h1>
      <p style={{ color: "#6B7280", marginBottom: 24 }}>Pick a section to get started.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              display: "block",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: 16,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{l.label}</div>
            <div style={{ color: "#6B7280" }}>{l.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
