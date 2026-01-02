// app/layout.tsx
import '../components/AppShell';
import React from 'react';
import AppShell from '../components/AppShell';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
