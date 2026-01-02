"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <Link href="/">Home</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/market">Market</Link>
      </header>
      {children}
    </div>
  );
}
