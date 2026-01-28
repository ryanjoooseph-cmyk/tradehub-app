import "../globals.css";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

const Nav = () => (
  <aside className="w-64 border-r bg-background">
    <div className="p-4">
      <div className="font-bold text-xl tracking-tight">TradeHub</div>
      <div className="text-xs text-muted-foreground mt-1">A++ foundation</div>
    </div>
    <Separator />
    <nav className="p-3 text-sm space-y-1">
      <a className="block rounded-md px-3 py-2 hover:bg-muted" href="/app">Dashboard</a>
      <a className="block rounded-md px-3 py-2 hover:bg-muted" href="/app/jobs">Jobs</a>
      <a className="block rounded-md px-3 py-2 hover:bg-muted" href="/app/calendar">Calendar</a>
      <a className="block rounded-md px-3 py-2 hover:bg-muted" href="/app/settings">Settings</a>
    </nav>
  </aside>
);

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Nav />
      <div className="flex-1">
        <header className="h-14 border-b flex items-center justify-between px-6">
          <div className="text-sm text-muted-foreground">TradeHub Platform</div>
          <div className="text-sm">v0</div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
