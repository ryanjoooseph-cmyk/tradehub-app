export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4">
        <div className="font-bold text-lg">TradeHub</div>
        <nav className="mt-6 space-y-2 text-sm">
          <a className="block hover:underline" href="/app">Dashboard</a>
          <a className="block hover:underline" href="/app/jobs">Jobs</a>
          <a className="block hover:underline" href="/app/calendar">Calendar</a>
          <a className="block hover:underline" href="/app/settings">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
