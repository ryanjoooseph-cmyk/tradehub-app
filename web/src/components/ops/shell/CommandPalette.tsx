"use client";

import * as React from "react";
import { Command } from "cmdk";

type Item = { label: string; href: string; keywords?: string[] };

export default function CommandPalette(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: Item[];
}) {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        props.onOpenChange(!props.open);
      }
      if (e.key === "Escape") props.onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [props]);

  return (
    <div
      className={
        props.open
          ? "fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-24"
          : "hidden"
      }
      onMouseDown={() => props.onOpenChange(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border bg-background shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <Command className="w-full">
          <div className="border-b p-4">
            <div className="text-xs font-semibold text-muted-foreground">Command</div>
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search pages, actions…"
              className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none"
              autoFocus
            />
            <div className="mt-2 text-[11px] text-muted-foreground">Tip: ⌘K / Ctrl+K</div>
          </div>

          <Command.List className="max-h-[420px] overflow-auto p-2">
            <Command.Empty className="p-6 text-sm text-muted-foreground">No results.</Command.Empty>
            {props.items.map((it) => (
              <Command.Item
                key={it.href}
                value={[it.label, (it.keywords ?? []).join(" ")].join(" ")}
                onSelect={() => {
                  props.onOpenChange(false);
                  window.location.href = it.href;
                }}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-muted/40"
              >
                <span className="font-medium">{it.label}</span>
                <span className="text-xs text-muted-foreground">{it.href}</span>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
