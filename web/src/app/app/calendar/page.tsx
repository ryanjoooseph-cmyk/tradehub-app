export const dynamic = "force-dynamic";
export const revalidate = 0;

import DragDropCalendar from "../../../components/calendar/DragDropCalendar";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-background/60 p-6 shadow-sm">
        <div className="text-3xl font-extrabold tracking-tight">Calendar</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Drag-and-drop scheduling. Click to create jobs. Click events to rename.
        </div>
      </div>

      <DragDropCalendar />
    </div>
  );
}
