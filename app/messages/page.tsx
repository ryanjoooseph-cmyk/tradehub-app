// app/messages/page.tsx
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Messages</h1>
      <p style={{ color: '#6b7280' }}>
        Messaging UI placeholder. Next step: conversations, threads, and live updates.
      </p>
      <div style={{ marginTop: 16, border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <div style={{ color: '#6b7280' }}>No conversations yet.</div>
      </div>
    </div>
  );
}
