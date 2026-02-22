export const dynamic = "force-dynamic"
export const revalidate = 0

import "./globals.css";
import Providers from "./providers";
import { CommandPalette } from "@/components/CommandPalette";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}







