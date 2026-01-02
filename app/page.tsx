import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to TradeHub</h1>
      <p>Start with a module:</p>
      <ul>
        <li><Link href="/jobs">Jobs</Link></li>
        <li><Link href="/market">Market</Link></li>
      </ul>
    </div>
  );
}
