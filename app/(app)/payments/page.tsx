export default function PaymentsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Payments</h1>
      <p style={{ opacity: 0.75 }}>
        Escrow balances, milestones, and releases will appear here. We’ll wire this to Stripe/PayID when ready.
      </p>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <div style={{ fontWeight: 700 }}>Balances</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>No funds yet.</div>
      </div>
    </div>
  );
}
