import Scheduler from '@/components/Scheduler';

export default function CalendarPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Jobs Calendar</h1>
      <Scheduler />
    </div>
  );
}
