"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function applyTheme(mode: ThemeMode) {
  try {
    localStorage.setItem("th_theme", mode);
  } catch {}
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function detectInitial(): ThemeMode {
  try {
    const saved = localStorage.getItem("th_theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const m = detectInitial();
    setMode(m);
    applyTheme(m);
    setReady(true);
  }, []);

  const next: ThemeMode = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
      onClick={() => {
        const m = next;
        setMode(m);
        applyTheme(m);
      }}
      disabled={!ready}
    >
      <span className="text-xs font-semibold tracking-tight">{mode === "dark" ? "Dark" : "Light"}</span>
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border text-[11px]">
        {mode === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
