"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NAV } from "@/components/shell/nav";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/shell/command-palette";
import { Toaster } from "@/components/ui/sonner";

import { Menu, Sparkles, Bell, ChevronDown } from "lucide-react";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="leading-tight">
        <div className="font-semibold tracking-tight">TradeHub</div>
        <div className="text-xs text-muted-foreground">Operations OS</div>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const core = NAV.filter((n) => n.group === "Core");
  const ops = NAV.filter((n) => n.group === "Operations");

  const Item = ({ href, label, Icon }: { href: string; label: string; Icon: any }) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className={cn("h-4 w-4 transition", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <div className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Core</div>
        <div className="grid gap-1">
          {core.map((n) => (
            <Item key={n.href} href={n.href} label={n.label} Icon={n.icon} />
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Operations</div>
        <div className="grid gap-1">
          {ops.map((n) => (
            <Item key={n.href} href={n.href} label={n.label} Icon={n.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 rounded-2xl px-3">
          <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-muted text-xs font-semibold">RJ</span>
          <span className="hidden max-w-[220px] truncate text-left text-sm font-medium md:block">ryan.joooseph@icloud.com</span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Session</DropdownMenuLabel>
        <DropdownMenuItem className="rounded-xl">Profile</DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl">Preferences</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-xl text-red-600 focus:text-red-600">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen bg-muted/30">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_55%)]" />
        </div>

        <div className="mx-auto flex max-w-[1440px]">
          <aside className="hidden w-[292px] shrink-0 border-r bg-background md:block">
            <div className="flex h-16 items-center justify-between px-5">
              <Brand />
              <Badge variant="outline" className="rounded-full">A++</Badge>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-8rem)] px-3 py-4">
              <NavList />
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Build</div>
                <div className="text-xs font-medium">Stable</div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="sticky top-0 z-30 border-b bg-background/75 backdrop-blur">
              <div className="flex h-16 items-center gap-3 px-4 md:px-7">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl md:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] p-0">
                    <div className="flex h-16 items-center justify-between px-5">
                      <Brand />
                      <Badge variant="outline" className="rounded-full">A++</Badge>
                    </div>
                    <Separator />
                    <div className="px-3 py-4">
                      <NavList onNavigate={() => {}} />
                    </div>
                  </SheetContent>
                </Sheet>

                <CommandPalette />

                <div className="ml-auto flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-xl">Notifications</TooltipContent>
                  </Tooltip>

                  <UserMenu />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 md:px-7">{children}</div>
          </main>
        </div>

        <Toaster richColors closeButton />
      </div>
    </TooltipProvider>
  );
}
