import { Topbar } from "@/components/app/topbar";
import { Sidenav } from "@/components/app/sidenav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,hsl(var(--muted))/0.55,transparent_50%),radial-gradient(900px_circle_at_90%_10%,hsl(var(--muted))/0.45,transparent_50%)]">
      <Topbar />
      <div className="mx-auto flex max-w-[1600px]">
        <Sidenav />
        <main className="min-h-[calc(100vh-4rem)] w-full p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
