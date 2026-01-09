import dynamic from 'next/dynamic';
const Scheduler = dynamic(() => import('@/components/Scheduler'), { ssr: false });

export default function Page() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Jobs Calendar</h1>
      <Scheduler />
    </div>
  );
}
