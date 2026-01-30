import {
  LayoutGrid,
  Briefcase,
  CalendarDays,
  Users,
  Receipt,
  ShieldCheck,
  Users2,
  Settings2,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: any;
  group: "Core" | "Operations";
};

export const NAV: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutGrid, group: "Core" },
  { href: "/app/jobs", label: "Jobs", icon: Briefcase, group: "Core" },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays, group: "Core" },
  { href: "/app/clients", label: "Clients", icon: Users, group: "Core" },
  { href: "/app/invoices", label: "Invoices", icon: Receipt, group: "Core" },
  { href: "/app/escrow", label: "Escrow", icon: ShieldCheck, group: "Operations" },
  { href: "/app/team", label: "Team", icon: Users2, group: "Operations" },
  { href: "/app/settings", label: "Settings", icon: Settings2, group: "Operations" },
];
