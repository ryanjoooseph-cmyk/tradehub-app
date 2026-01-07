'use client';
import useSession from '../../lib/auth/useSession';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, ready } = useSession();
  if (!ready) return <div style={{padding:24}}>Loading…</div>;
  if (!session) return <div style={{padding:24}}>
    You’re signed out. <a href="/login">Sign in</a>
  </div>;
  return <>{children}</>;
}
