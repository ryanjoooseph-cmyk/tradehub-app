import CalendarBoard from "@/components/calendar/CalendarBoard";

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Calendar</div>
        <div className="text-sm text-muted-foreground">
          Drag jobs onto the calendar • Move & resize events • Plan the week like a real ops platform.
        </div>
      </div>
      <CalendarBoard />
    </div>
  );
}
