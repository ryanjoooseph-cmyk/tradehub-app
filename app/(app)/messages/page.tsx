export default function MessagesPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Messages</h1>
      <p style={{ opacity: 0.75 }}>Threaded conversations between clients and tradies. Realtime hooks come next.</p>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>No conversations yet.</div>
      </div>
    </div>
  );
}
