// app/layout.tsx
import React from "react";
// If you have a global stylesheet at app/styles.css, keep this import.
// If not, it's safe to remove.
import "./styles.css";
import AppShell from "a/components/AppShell";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
