import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeHub",
  description: "TradeHub Ops Console",
};

const themeScript = `
(function() {
  try {
    var key = "th_theme";
    var saved = localStorage.getItem(key);
    var theme = (saved === "dark" || saved === "light") ? saved : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  } catch (e) {}
})();`;

import ThemeProvider from "@/components/app/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
