import { LayoutDashboard, Calendar, Briefcase, Users, FileText, Settings, UsersRound, Landmark, Kanban } from "lucide-react";

export const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dispatch", label: "Dispatch", icon: Kanban },
  { href: "/app/calendar", label: "Calendar", icon: Calendar },
  { href: "/escrow", label: "Escrow", icon: Landmark },
  { href: "/app/jobs", label: "Jobs", icon: Briefcase },
  { href: "/app/clients", label: "Clients", icon: Users },
  { href: "/app/invoices", label: "Invoices", icon: FileText },
  { href: "/app/team", label: "Team", icon: UsersRound },
  { href: "/app/settings", label: "Settings", icon: Settings },
] as const;
