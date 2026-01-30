import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Briefcase, CalendarDays, Users, Receipt, UsersRound, ShieldCheck, Settings } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const navItems: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/jobs", label: "Jobs", icon: Briefcase },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/app/clients", label: "Clients", icon: Users },
  { href: "/app/invoices", label: "Invoices", icon: Receipt },
  { href: "/app/team", label: "Team", icon: UsersRound },
  { href: "/app/escrow", label: "Escrow", icon: ShieldCheck },
  { href: "/app/settings", label: "Settings", icon: Settings },
];
