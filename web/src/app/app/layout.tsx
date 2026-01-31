import { AppShell } from "@/components/app/shell/shell";


export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
