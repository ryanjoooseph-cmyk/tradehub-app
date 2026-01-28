import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>TradeHub</h1>
      <p>OK</p>
      <p><Link href="/app">Go to /app →</Link></p>
    </main>
  );
}
