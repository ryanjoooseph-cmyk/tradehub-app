import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "TradeHub", template: "%s · TradeHub" },
  description: "Jobs • Clients • Quotes",
};

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  marginRight: 8,
  borderRadius: 6,
  textDecoration: "none",
  color: "#111827",
  background: "#F3F4F6",
  border: "1px solid #E5E7EB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <header style={{ borderBottom: "1px solid #E5E7EB", padding: "16px 24px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700 }}>TradeHub</div>
            <nav>
              <Link href="/" style={linkStyle as any}>Home</Link>
              <Link href="/dashboard" style={linkStyle as any}>Dashboard</Link>
              <Link href="/clients" style={linkStyle as any}>Clients</Link>
              <Link href="/jobs" style={linkStyle as any}>Jobs</Link>
              <Link href="/quotes" style={linkStyle as any}>Quotes</Link>
            </nav>
          </div>
        </header>
        <main style={{ maxWidth: 980, margin: "24px auto", padding: "0 24px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
