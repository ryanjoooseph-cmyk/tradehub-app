import './globals.css';
import Link from 'next/link';
import useSession from '../lib/auth/useSession';

function Nav() {
  'use client';
  const { session } = useSession();
  return (
    <nav style={{display:'flex',gap:12,padding:12,borderBottom:'1px solid #eee'}}>
      <Link href="/">Home</Link>
      <Link href="/clients">Clients</Link>
      <Link href="/jobs">Jobs</Link>
      <Link href="/quotes">Quotes</Link>
      <Link href="/invoices">Invoices</Link>
      <Link href="/payments">Payments</Link>
      <Link href="/disputes">Disputes</Link>
      <Link href="/tenants">Tenants</Link>
      <Link href="/admin">Admin</Link>
      <span style={{marginLeft:'auto'}} />
      {session ? (
        <>
          <span style={{opacity:.6}}> {session.user.email ?? session.user.id} </span>
          <Link href="/logout">Logout</Link>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <Nav />
      <div style={{padding:16}}>{children}</div>
    </body></html>
  );
}
