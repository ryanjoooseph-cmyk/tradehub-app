export default function ProfilePage() {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Profile & KYC</h1>
      <p style={{ opacity: 0.75, marginTop: 0 }}>
        Upload licenses, ABN, insurance certificates; verify identity; choose whether you’re hiring or trading.
      </p>
      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700 }}>Identity</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>To be connected to verification provider.</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700 }}>Business details</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>ABN, trading name, categories.</div>
        </div>
      </div>
    </div>
  );
}
