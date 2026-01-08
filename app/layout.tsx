// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "TradeHub",
  description: "Live build — TradeHub platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-badge" />
              TradeHub
            </div>
            <nav className="nav">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/clients">Clients</Link>
              <Link href="/invoices">Invoices</Link>
              <Link href="/quotes">Quotes</Link>
              <Link href="/jobs">Jobs</Link>
              <Link href="/payments">Payments</Link>
              <Link href="/tenants">Tenants</Link>
              <Link href="/screens">Screens</Link>
              <Link href="/ops">Ops</Link>
            </nav>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
