"use client";
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html><body style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Something went wrong</h1>
      <p style={{ color: "#6B7280" }}>{error.message}</p>
    </body></html>
  );
}
