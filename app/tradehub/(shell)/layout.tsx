import '../../globals.css';
import NavBar from '@/components/NavBar';

export const metadata = { title: 'TradeHub', description: 'Milestone escrow for trades' };

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <NavBar />
        <main className="container">{children}</main>
        <div className="container footer">Demo only • No real data • © 2025 TradeHub</div>
      </body>
    </html>
  );
}
