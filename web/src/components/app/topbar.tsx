"use client";

import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Bolt, Plus, Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-4">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          TradeHub <span className="text-muted-foreground font-medium">Ops Platform</span>
        </div>

        <div className="ml-4 hidden w-[520px] max-w-[52vw] items-center gap-2 rounded-md border bg-background px-2 sm:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            className="h-9 border-0 bg-transparent px-0 focus-visible:ring-0"
            placeholder="Search jobs, clients, invoices, escrow…"
          />
          <div className="text-xs text-muted-foreground">⌘K</div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Quick actions">
            <Bolt className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Create">
            <Plus className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
