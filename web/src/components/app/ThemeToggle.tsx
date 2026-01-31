"use client";

import { useEffect, useState } from "react";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const saved = window.localStorage.getItem("theme");
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return document.documentElement.classList.contains("dark");
}

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => getInitialDark());

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setDark((v) => !v)}
      className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      {dark ? "Dark" : "Light"}
    </button>
  );
}
