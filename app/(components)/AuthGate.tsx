"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSession from "@/lib/auth/useSession";

// Accept several hook shapes and normalize to { ready, authed }
type HookMaybe =
  | { session?: unknown; ready?: boolean }
  | { status?: "loading" | "authenticated" | "unauthenticated"; data?: unknown }
  | string;

function normalize(auth: HookMaybe): { ready: boolean; authed: boolean } {
  if (typeof auth === "string") {
    return { ready: auth !== "loading", authed: auth === "authenticated" };
  }
  if (auth && typeof auth === "object") {
    if ("ready" in auth) {
      return { ready: !!(auth as any).ready, authed: !!(auth as any).session };
    }
    if ("status" in auth) {
      const st = (auth as any).status;
      return { ready: st !== "loading", authed: st === "authenticated" || !!(auth as any).data };
    }
  }
  return { ready: true, authed: !!auth };
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useSession() as any;

  const { ready, authed } = normalize(auth);

  if (!ready) return null;
  if (!authed) {
    router.push("/login");
    return null;
  }
  return <>{children}</>;
}
