// app/(components)/AuthGate.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useSession from "@/lib/auth/useSession"; // keep this hook client-only

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession(); // whatever your hook returns

  // Tweak to your app’s states
  if (session === "loading") return null;
  if (session === "unauthenticated") {
    router.push("/login");
    return null;
  }
  return <>{children}</>;
}
