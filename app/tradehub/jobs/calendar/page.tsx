import Scheduler from '@/components/Scheduler';

export const dynamic = 'force-dynamic';

export default function CalendarPage() {
  return (
    <main className="max-w-[1400px] mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Jobs → Calendar</h1>
        <p className="text-sm text-gray-500">Drag jobs to schedule across teams/vehicles.</p>
      </div>
      <Scheduler />
    </main>
  );
}
