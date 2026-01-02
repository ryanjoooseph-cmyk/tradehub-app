// app/page.tsx  (Dashboard)
import React from 'react';

export default function Home() {
  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Welcome to TradeHub. Use the quick actions below to get moving.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        <a href="/jobs" style={cardStyle}>
          <div style={cardTitle}>Jobs</div>
          <div style={cardText}>View and create job requests.</div>
        </a>
        <a href="/market" style={cardStyle}>
          <div style={cardTitle}>Market</div>
          <div style={cardText}>Browse tradespeople and services.</div>
        </a>
        <a href="/messages" style={cardStyle}>
          <div style={cardTitle}>Messages</div>
          <div style={cardText}>Keep conversations in one place.</div>
        </a>
        <a href="/profile" style={cardStyle}>
          <div style={cardTitle}>Profile</div>
          <div style={cardText}>Update your business details.</div>
        </a>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: 16,
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  textDecoration: 'none',
  color: '#111827',
};
const cardTitle: React.CSSProperties = { fontWeight: 700, marginBottom: 6 };
const cardText: React.CSSProperties = { color: '#6b7280' };
