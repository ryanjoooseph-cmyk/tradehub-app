// app/market/page.tsx
import React from 'react';

export const dynamic = 'force-dynamic';

const mock = [
  { id: 'p1', title: 'Licensed Electrician', blurb: 'Switchboards • EV chargers • Rewiring', region: 'Melbourne' },
  { id: 'p2', title: 'Plumber', blurb: 'Hot water • Gas fitting • Blocked drains', region: 'Geelong' },
  { id: 'p3', title: 'Carpenter', blurb: 'Decks • Framing • Doors & windows', region: 'Mornington' },
];

export default async function MarketPage() {
  return (
    <div style={{ maxWidth: 960 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Market</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Browse trades and services. (Hook to real data next.)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16 }}>
        {mock.map(m => (
          <div key={m.id} style={{ border: '1px solid #e5e7eb', padding: 16, borderRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{m.title}</div>
            <div style={{ color: '#6b7280', marginBottom: 8 }}>{m.blurb}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{m.region}</div>
            <a href="/messages" style={{ display: 'inline-block', marginTop: 12, fontWeight: 600 }}>Message</a>
          </div>
        ))}
      </div>
    </div>
  );
}
