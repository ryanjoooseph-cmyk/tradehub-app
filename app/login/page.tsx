"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main style={{ maxWidth: 420, margin: "64px auto", fontFamily: "system-ui" }}>
      <h1>Sign in</h1>
      <p style={{ opacity: 0.7, marginBottom: 16 }}>
        This is a public page. AuthGate will not run here.
      </p>

      {/* Replace with your real form / Supabase widget later */}
      <form onSubmit={(e) => { e.preventDefault(); location.href = "/dashboard"; }}>
        <label>Email<br/><input type="email" required placeholder="you@example.com" /></label>
        <br/><br/>
        <label>Password<br/><input type="password" required placeholder="••••••••" /></label>
        <br/><br/>
        <button type="submit">Continue</button>
      </form>

      <p style={{ marginTop: 16 }}>
        No account? <Link href="/register">Create one</Link>
      </p>
    </main>
  );
}
