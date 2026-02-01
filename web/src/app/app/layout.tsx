export const dynamic = "force-dynamic"
export const revalidate = 0

import AppShell from "@/components/app/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
