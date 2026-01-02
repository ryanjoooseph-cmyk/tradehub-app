// app/jobs/SubmitJob.tsx  (client component)
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitJob() {
  const [title, setTitle] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setPending(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`POST /api/jobs ${res.status}`);
      setTitle('');
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New job title"
        style={{ flex: 1, padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
      />
      <button disabled={pending} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #111827' }}>
        {pending ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}
