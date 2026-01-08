'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const tabs = [
  { href: '/tradehub/dashboard', label: 'Dashboard' },
  { href: '/tradehub/jobs/calendar', label: 'Jobs' },
  { href: '/tradehub/escrow', label: 'Escrow' },
  { href: '/tradehub/disputes', label: 'Disputes' },
  { href: '/tradehub/kyc', label: 'KYC' },
  { href: '/tradehub/payments', label: 'Payments' },
  { href: '/tradehub/admin', label: 'Admin' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <div className="nav">
      <div className="nav-inner container">
        <div className="brand">
          <Link href="/tradehub/dashboard" style={{ color: 'var(--fg)' }}>TradeHub</Link>
          <span className="pill">EchoVault</span>
        </div>
        <div className="tabs">
          {tabs.map(t => {
            const active = pathname?.startsWith(t.href);
            return <Link key={t.href} className={`tab ${active ? 'active' : ''}`} href={t.href}>{t.label}</Link>;
          })}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
