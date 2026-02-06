import Link from "next/link";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple topbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/market" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-foreground" />
            <div>
              <div className="text-lg font-bold">TradeHub</div>
              <div className="text-[10px] text-muted-foreground">Marketplace</div>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/market" className="text-sm hover:underline">
              Home
            </Link>
            <Link href="/market/post-job" className="text-sm hover:underline">
              Post a Job
            </Link>
            <Link href="/app/dashboard" className="rounded-lg border bg-foreground px-4 py-2 text-sm text-background hover:opacity-90">
              Go to Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
