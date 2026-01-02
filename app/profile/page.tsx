// app/profile/page.tsx
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Profile</h1>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Company and contact details. (We’ll wire persistence next.)
      </p>

      <form style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Display name</span>
          <input style={inp} placeholder="e.g., Rye J." />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Company</span>
          <input style={inp} placeholder="e.g., TradeHub Pty Ltd" />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Region</span>
          <input style={inp} placeholder="e.g., Melbourne, VIC" />
        </label>
        <button type="button" style={btn}>Save (disabled)</button>
      </form>
    </div>
  );
}

const inp: React.CSSProperties = { padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 };
const btn: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 8, border: '1px solid #111827', fontWeight: 600, cursor: 'not-allowed',
};
