// app/layout.tsx
import React from "react";
import AppShell from "../components/AppShell";

export const metadata = {
  title: "TradeHub",
  description: "TradeHub platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
