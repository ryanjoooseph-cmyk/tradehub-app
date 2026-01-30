"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { NAV } from "@/components/shell/nav";
import { Search } from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const core = NAV.filter((n) => n.group === "Core");
  const ops = NAV.filter((n) => n.group === "Operations");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group hidden w-[520px] max-w-full items-center gap-3 rounded-2xl border bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur md:flex"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 truncate text-left">Search anything…</span>
        <span className="rounded-lg border px-2 py-1 text-[11px] text-muted-foreground">
          ⌘K
        </span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>

          <CommandGroup heading="Core">
            {core.map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Operations">
            {ops.map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
