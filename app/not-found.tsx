import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Page not found
      </h1>
      <p style={{ marginBottom: "1rem" }}>
        Sorry, we couldn’t find that page.
      </p>
      <Link href="/">← Go back home</Link>
    </main>
  );
}
