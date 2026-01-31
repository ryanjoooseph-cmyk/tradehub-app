"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const KEY = "th_theme";

function getInitial(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(KEY);
  if (saved === "dark" || saved === "light") return saved;
  const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return mq ? "dark" : "light";
}

function applyTheme(next: "dark" | "light") {
  const root = document.documentElement;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  window.localStorage.setItem(KEY, next);
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"dark" | "light">("light");

  React.useEffect(() => {
    const t = getInitial();
    setTheme(t);
    applyTheme(t);
  }, []);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="secondary"
      className="rounded-2xl"
      onClick={() => {
        setTheme(next);
        applyTheme(next);
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
