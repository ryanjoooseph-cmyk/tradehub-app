"use client";

import React from "react";
import Link from "next/link";
import { GripVertical, Clock, MapPin, Users, AlertTriangle, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Truck, CheckCircle, ExternalLink, Edit3, Copy, Check, Save, DollarSign } from "lucide-react";

type EventStatus = "scheduled" | "in-progress" | "completed";
type EventPriority = "normal" | "high" | "urgent";

type DispatchEvent = {
  id: string;
  title: string;
  client: string;
  site: string;
  day: number;
  startMin: number;
  durMin: number;
  crew: string[];
  status: EventStatus;
  priority: EventPriority;
  valueCents: number;
  notes?: string;
};

type BacklogJob = {
  id: string;
  title: string;
  client: string;
  site: string;
  crew: string[] | null;
  priority: EventPriority;
  valueCents: number;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function cx(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function minutesToShort(min: number) {
  const h = Math.floor(min / 60);
  const suffix = h >= 12 ? "p" : "a";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}${suffix}`;
}

function minutesToFull(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${suffix}`;
}

function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

// Seeded dispatch events
const initialEvents: DispatchEvent[] = [
  { id: 'J-1402', title: 'Tower A repaint', client: 'Acme Body Corp', site: 'Southbank', day: 0, startMin: 8 * 60, durMin: 300, crew: ['Ryan J', 'Crew A'], status: 'in-progress', priority: 'high', valueCents: 1890000, notes: 'Multi-day job. Progress photos at end of each day.' },
  { id: 'J-1403', title: 'High-rise touch-up', client: 'Carlton Strata', site: 'CBD', day: 1, startMin: 9 * 60, durMin: 240, crew: ['Crew B'], status: 'scheduled', priority: 'normal', valueCents: 450000 },
  { id: 'J-1404', title: 'Balcony sealing', client: 'Bayside Strata', site: 'St Kilda', day: 2, startMin: 10 * 60, durMin: 180, crew: ['Crew A'], status: 'scheduled', priority: 'normal', valueCents: 320000 },
  { id: 'J-1406', title: 'Heritage restoration', client: 'South Yarra Owners', site: 'South Yarra', day: 3, startMin: 8 * 60, durMin: 360, crew: ['Ryan J', 'Crew C'], status: 'scheduled', priority: 'urgent', valueCents: 2450000, notes: 'Heritage overlay requirements.' },
  { id: 'J-1408', title: 'Roof deck repair', client: 'Docklands Mgmt', site: 'Docklands', day: 4, startMin: 14 * 60, durMin: 180, crew: ['QA', 'Crew B'], status: 'scheduled', priority: 'normal', valueCents: 185000 },
  { id: 'J-1409', title: 'Facade inspection', client: 'Melbourne Property', site: 'Richmond', day: 5, startMin: 9 * 60, durMin: 240, crew: ['Ryan J'], status: 'scheduled', priority: 'high', valueCents: 95000 },
  { id: 'J-1411', title: 'Strata QA check', client: 'Brunswick Estates', site: 'Brunswick', day: 6, startMin: 11 * 60, durMin: 180, crew: ['QA'], status: 'completed', priority: 'normal', valueCents: 75000 },
];

// Seeded backlog
const initialBacklog: BacklogJob[] = [
  { id: 'J-1405', title: 'QA inspection', client: 'Docklands Tower', site: 'Docklands', crew: null, priority: 'normal', valueCents: 65000 },
  { id: 'J-1410', title: 'Paint touch-up', client: 'Preston Strata', site: 'Preston', crew: null, priority: 'high', valueCents: 125000 },
  { id: 'J-1412', title: 'Window sealing', client: 'Footscray Dev', site: 'Footscray', crew: null, priority: 'urgent', valueCents: 280000 },
  { id: 'J-1413', title: 'Balcony repairs', client: 'Richmond Owners', site: 'Richmond', crew: null, priority: 'normal', valueCents: 420000 },
  { id: 'J-1414', title: 'Exterior cleaning', client: 'CBD Mgmt', site: 'CBD', crew: null, priority: 'high', valueCents: 180000 },
];

// Event card colors based on status and priority
function getEventStyles(status: EventStatus, priority: EventPriority, isConflict: boolean) {
  if (isConflict) {
    return "border-red-500/60 bg-red-50 dark:bg-red-950/40 ring-2 ring-red-500/30";
  }

  if (priority === 'urgent') {
    return "border-rose-400/60 bg-rose-50 dark:bg-rose-950/30 ring-1 ring-rose-400/30";
  }

  if (priority === 'high') {
    return "border-amber-400/60 bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-400/30";
  }

  switch (status) {
    case 'in-progress':
      return "border-blue-400/60 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-400/30";
    case 'completed':
      return "border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-400/30";
    default:
      return "border-border/60 bg-card dark:bg-card/90 ring-1 ring-border/30";
  }
}

function getPriorityIndicator(priority: EventPriority) {
  if (priority === 'urgent') {
    return <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse ring-2 ring-rose-500/20" />;
  }
  if (priority === 'high') {
    return <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />;
  }
  return null;
}

function Pill({ children, tone }: { children: React.ReactNode; tone: 'good' | 'warn' | 'bad' | 'neutral' }) {
  const colors = {
    good: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    warn: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    bad: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    neutral: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", colors[tone])}>
      {children}
    </span>
  );
}

// Event Detail Overlay Component
function EventDetailOverlay({
  event,
  onClose,
  onUpdate,
  onMarkComplete,
  onDuplicate,
  hasConflict,
  allCrews,
}: {
  event: DispatchEvent;
  onClose: () => void;
  onUpdate: (updated: DispatchEvent) => void;
  onMarkComplete: () => void;
  onDuplicate: () => void;
  hasConflict: boolean;
  allCrews: string[];
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editCrew, setEditCrew] = React.useState<string[]>(event.crew);
  const [editStartMin, setEditStartMin] = React.useState(event.startMin);
  const [editDurMin, setEditDurMin] = React.useState(event.durMin);
  const [editNotes, setEditNotes] = React.useState(event.notes || '');
  const [editDay, setEditDay] = React.useState(event.day);

  const handleSave = () => {
    onUpdate({
      ...event,
      crew: editCrew,
      startMin: editStartMin,
      durMin: editDurMin,
      notes: editNotes,
      day: editDay,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCrew(event.crew);
    setEditStartMin(event.startMin);
    setEditDurMin(event.durMin);
    setEditNotes(event.notes || '');
    setEditDay(event.day);
    setIsEditing(false);
  };

  const timeOptions = React.useMemo(() => {
    const options: { value: number; label: string }[] = [];
    for (let m = 6 * 60; m <= 20 * 60; m += 30) {
      options.push({ value: m, label: minutesToFull(m) });
    }
    return options;
  }, []);

  const durationOptions = [
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 300, label: '5 hours' },
    { value: 360, label: '6 hours' },
    { value: 480, label: '8 hours' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">{event.id}</span>
            <Pill tone={
              event.status === 'completed' ? 'good' :
              event.status === 'in-progress' ? 'warn' :
              'neutral'
            }>
              {event.status === 'in-progress' ? 'In Progress' :
               event.status === 'completed' ? 'Done' : 'Scheduled'}
            </Pill>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-xl font-bold leading-tight">{event.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{event.client}</p>
          </div>

          {/* Value Display */}
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 ring-1 ring-emerald-500/20">
            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{money(event.valueCents)}</span>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
              className={cx(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isEditing ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
              )}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Reschedule
            </button>
            <button
              onClick={onDuplicate}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>
            {event.status !== 'completed' && (
              <button
                onClick={onMarkComplete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Mark Complete
              </button>
            )}
          </div>

          {!isEditing ? (
            <>
              <div className="rounded-xl bg-muted/30 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Site</span>
                  <span className="font-semibold">{event.site}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Day</span>
                  <span className="font-semibold">{fullDays[event.day]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Time</span>
                  <span className="font-semibold">{minutesToFull(event.startMin)} – {minutesToFull(event.startMin + event.durMin)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Duration</span>
                  <span className="font-semibold">{(event.durMin / 60).toFixed(1)}h</span>
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned Crew</div>
                <div className="flex flex-wrap gap-2">
                  {event.crew.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm font-semibold">
                      <Users className="h-3.5 w-3.5" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {event.notes && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.notes}</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Day</label>
                <select
                  value={editDay}
                  onChange={(e) => setEditDay(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ring/20"
                >
                  {days.map((d, i) => (
                    <option key={d} value={i}>{fullDays[i]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start Time</label>
                  <select
                    value={editStartMin}
                    onChange={(e) => setEditStartMin(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ring/20"
                  >
                    {timeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Duration</label>
                  <select
                    value={editDurMin}
                    onChange={(e) => setEditDurMin(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ring/20"
                  >
                    {durationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Crew</label>
                <div className="flex flex-wrap gap-2">
                  {allCrews.map((crew) => (
                    <button
                      key={crew}
                      type="button"
                      onClick={() => {
                        if (editCrew.includes(crew)) {
                          setEditCrew(editCrew.filter(c => c !== crew));
                        } else {
                          setEditCrew([...editCrew, crew]);
                        }
                      }}
                      className={cx(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        editCrew.includes(crew)
                          ? "bg-foreground text-background"
                          : "border bg-background hover:bg-muted"
                      )}
                    >
                      {crew}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ring/20 resize-none"
                  placeholder="Add notes..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {hasConflict && (
            <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950/30 ring-1 ring-red-500/20">
              <div className="flex items-center gap-2 text-sm font-semibold text-red-900 dark:text-red-100">
                <AlertTriangle className="h-4 w-4" />
                Crew Conflict Detected
              </div>
              <p className="mt-1.5 text-xs text-red-800 dark:text-red-200 leading-relaxed">
                One or more crew members are double-booked at this time.
              </p>
            </div>
          )}

          {(event.priority === 'high' || event.priority === 'urgent') && (
            <div className={cx(
              "rounded-xl p-4 ring-1",
              event.priority === 'urgent'
                ? "bg-rose-50 dark:bg-rose-950/30 ring-rose-500/20"
                : "bg-amber-50 dark:bg-amber-950/30 ring-amber-500/20"
            )}>
              <div className={cx(
                "text-sm font-semibold",
                event.priority === 'urgent'
                  ? "text-rose-900 dark:text-rose-100"
                  : "text-amber-900 dark:text-amber-100"
              )}>
                {event.priority === 'urgent' ? 'Urgent Priority' : 'High Priority'}
              </div>
              <p className={cx(
                "mt-1 text-xs leading-relaxed",
                event.priority === 'urgent'
                  ? "text-rose-800 dark:text-rose-200"
                  : "text-amber-800 dark:text-amber-200"
              )}>
                {event.priority === 'urgent' ? 'Requires immediate attention' : 'Elevated priority job'}
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t bg-card p-4">
          <Link
            href={`/app/jobs/${event.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="h-4 w-4" />
            View Full Job Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DispatchPage() {
  const startDayMin = 7 * 60;
  const endDayMin = 19 * 60;
  const stepMin = 30;

  const [events, setEvents] = React.useState<DispatchEvent[]>(initialEvents);
  const [backlog, setBacklog] = React.useState<BacklogJob[]>(initialBacklog);
  const [selectedEvent, setSelectedEvent] = React.useState<DispatchEvent | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  const rows = Math.ceil((endDayMin - startDayMin) / stepMin);
  const pxPerStep = 56;
  const gridHeight = rows * pxPerStep;

  const allCrews = React.useMemo(() => {
    const crewSet = new Set<string>();
    events.forEach(e => e.crew.forEach(c => crewSet.add(c)));
    return Array.from(crewSet).sort();
  }, [events]);

  const hasConflict = (event: DispatchEvent): boolean => {
    const eventEnd = event.startMin + event.durMin;
    return events.some(other => {
      if (other.id === event.id || other.day !== event.day) return false;
      const otherEnd = other.startMin + other.durMin;
      const timeOverlap = event.startMin < otherEnd && eventEnd > other.startMin;
      const crewOverlap = event.crew.some(c => other.crew.includes(c));
      return timeOverlap && crewOverlap;
    });
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const onDragStart = (e: React.DragEvent, id: string, isBacklog: boolean) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ id, isBacklog }));
    e.dataTransfer.effectAllowed = "move";
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent, day: number, startMin: number) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { id, isBacklog } = data;

      if (isBacklog) {
        const job = backlog.find(j => j.id === id);
        if (!job) return;

        const newEvent: DispatchEvent = {
          id: job.id,
          title: job.title,
          client: job.client,
          site: job.site,
          day,
          startMin: clamp(Math.round(startMin / stepMin) * stepMin, startDayMin, endDayMin - stepMin),
          durMin: 120,
          crew: job.crew || ['Unassigned'],
          status: 'scheduled',
          priority: job.priority,
          valueCents: job.valueCents,
        };

        setEvents(prev => [...prev, newEvent]);
        setBacklog(prev => prev.filter(j => j.id !== id));
        showToast(`${job.id} scheduled for ${days[day]} at ${minutesToFull(startMin)}`);
      } else {
        const event = events.find(ev => ev.id === id);
        if (!event) return;

        const oldDay = days[event.day];
        const newDay = days[day];

        setEvents(prev =>
          prev.map(x =>
            x.id === id
              ? { ...x, day, startMin: clamp(Math.round(startMin / stepMin) * stepMin, startDayMin, endDayMin - stepMin) }
              : x
          )
        );

        showToast(`${event.id} moved from ${oldDay} to ${newDay} at ${minutesToFull(startMin)}`);
      }
    } catch {
      // Invalid drag data
    }
  };

  const handleUpdateEvent = (updated: DispatchEvent) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    setSelectedEvent(updated);
    showToast(`${updated.id} updated successfully`);
  };

  const handleMarkComplete = () => {
    if (!selectedEvent) return;
    const updated = { ...selectedEvent, status: 'completed' as EventStatus };
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    setSelectedEvent(updated);
    showToast(`${updated.id} marked as complete`);
  };

  const handleDuplicate = () => {
    if (!selectedEvent) return;
    const newId = `J-${Date.now().toString().slice(-4)}`;
    const duplicated: DispatchEvent = {
      ...selectedEvent,
      id: newId,
      status: 'scheduled',
    };
    setEvents(prev => [...prev, duplicated]);
    showToast(`Created duplicate: ${newId}`);
  };

  const slots = Array.from({ length: rows + 1 }, (_, i) => startDayMin + i * stepMin);
  const scheduledValue = events.reduce((sum, e) => sum + e.valueCents, 0);
  const backlogValue = backlog.reduce((sum, j) => sum + j.valueCents, 0);
  const conflictCount = events.filter(hasConflict).length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 px-5 py-3.5 shadow-lg ring-1 ring-emerald-500/20">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">{toast}</span>
          </div>
        </div>
      )}

      {/* Event Detail Overlay */}
      {selectedEvent && (
        <EventDetailOverlay
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={handleUpdateEvent}
          onMarkComplete={handleMarkComplete}
          onDuplicate={handleDuplicate}
          hasConflict={hasConflict(selectedEvent)}
          allCrews={allCrews}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Dispatch Board</h1>
              <p className="text-sm text-muted-foreground">
                Drag jobs from backlog to schedule. Click events for details.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
            <CalendarIcon className="h-4 w-4" />
            Today
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold">Scheduled Jobs</div>
          <div className="mt-1.5 text-2xl font-bold">{events.length}</div>
        </div>
        <div className="rounded-xl border bg-emerald-50 dark:bg-emerald-950/30 p-4 shadow-sm ring-1 ring-emerald-500/20">
          <div className="text-[11px] uppercase tracking-wide text-emerald-600/70 dark:text-emerald-400/70 font-semibold">Scheduled Value</div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{money(scheduledValue)}</div>
        </div>
        <div className="rounded-xl border bg-amber-50 dark:bg-amber-950/30 p-4 shadow-sm ring-1 ring-amber-500/20">
          <div className="text-[11px] uppercase tracking-wide text-amber-600/70 dark:text-amber-400/70 font-semibold">Backlog Value</div>
          <div className="mt-1.5 text-2xl font-bold text-amber-600 dark:text-amber-400">{money(backlogValue)}</div>
        </div>
        <div className={cx(
          "rounded-xl border p-4 shadow-sm ring-1",
          conflictCount > 0 ? "bg-red-50 dark:bg-red-950/30 ring-red-500/20" : "bg-card/50 ring-border/20"
        )}>
          <div className={cx(
            "text-[11px] uppercase tracking-wide font-semibold",
            conflictCount > 0 ? "text-red-600/70 dark:text-red-400/70" : "text-muted-foreground/70"
          )}>Conflicts</div>
          <div className={cx(
            "mt-1.5 text-2xl font-bold",
            conflictCount > 0 ? "text-red-600 dark:text-red-400" : "text-foreground"
          )}>{conflictCount}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Backlog Panel */}
        <div className="rounded-2xl border bg-card/50 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-3.5">
            <div>
              <div className="text-sm font-semibold">Backlog</div>
              <div className="text-xs text-muted-foreground">{backlog.length} unscheduled jobs</div>
            </div>
          </div>

          <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
            {backlog.map((job) => (
              <div
                key={job.id}
                draggable
                onDragStart={(e) => onDragStart(e, job.id, true)}
                className={cx(
                  "group flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-grab active:cursor-grabbing",
                  "bg-background hover:bg-muted/30 hover:border-border hover:shadow-sm",
                  job.priority === 'urgent' && "border-rose-400/30 bg-rose-50/50 dark:bg-rose-950/20",
                  job.priority === 'high' && "border-amber-400/30 bg-amber-50/50 dark:bg-amber-950/20"
                )}
              >
                <div className="mt-0.5 text-muted-foreground/40 group-hover:text-muted-foreground/60">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getPriorityIndicator(job.priority)}
                      <span className="text-xs font-mono font-semibold text-muted-foreground">{job.id}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{money(job.valueCents)}</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-tight">{job.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{job.client}</div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {job.site}
                  </div>
                </div>
              </div>
            ))}

            {backlog.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-border/30 bg-muted/10 p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
                    <CheckCircle className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <div>
                    <div className="font-semibold">All caught up!</div>
                    <div className="mt-1 text-sm text-muted-foreground">No unscheduled jobs in backlog</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-2xl border bg-card/50 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b bg-muted/20">
            <div className="flex items-center justify-center border-r py-4 bg-muted/10">
              <Clock className="h-4 w-4 text-muted-foreground/50" />
            </div>
            {days.map((day, i) => {
              const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
              return (
                <div
                  key={day}
                  className={cx(
                    "flex flex-col items-center justify-center border-r py-4 last:border-r-0",
                    isToday && "bg-foreground/5"
                  )}
                >
                  <div className="text-xs uppercase tracking-wide text-muted-foreground/70 font-semibold">
                    {day}
                  </div>
                  {isToday && (
                    <div className="mt-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      {new Date().getDate()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
            {/* Time Column */}
            <div className="relative border-r bg-muted/10" style={{ height: gridHeight }}>
              {slots.slice(0, -1).map((m) => (
                <div
                  key={m}
                  className="flex h-[56px] items-start justify-end pr-4 pt-0"
                >
                  {m % 60 === 0 && (
                    <span className="text-sm font-semibold text-muted-foreground/70 -translate-y-2.5">
                      {minutesToShort(m)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((_, d) => {
              const isToday = d === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
              return (
                <div
                  key={d}
                  className={cx(
                    "relative border-r last:border-r-0",
                    isToday && "bg-foreground/[0.02]"
                  )}
                  style={{ height: gridHeight }}
                  onDragOver={allowDrop}
                  onDrop={(ev) => {
                    const rect = (ev.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const y = ev.clientY - rect.top;
                    const stepIndex = Math.floor(y / pxPerStep);
                    const startMin = startDayMin + stepIndex * stepMin;
                    onDrop(ev, d, startMin);
                  }}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    {slots.slice(0, -1).map((m) => (
                      <div
                        key={m}
                        className={cx(
                          "h-[56px] border-b",
                          m % 60 === 0 ? "border-border/40" : "border-border/10"
                        )}
                      />
                    ))}
                  </div>

                  {/* Events */}
                  {events
                    .filter((e) => e.day === d)
                    .map((e) => {
                      const top = ((e.startMin - startDayMin) / stepMin) * pxPerStep + 4;
                      const h = Math.max(80, (e.durMin / stepMin) * pxPerStep - 8);
                      const isConflict = hasConflict(e);
                      const eventStyles = getEventStyles(e.status, e.priority, isConflict);

                      return (
                        <div
                          key={e.id}
                          draggable
                          onDragStart={(ev) => onDragStart(ev, e.id, false)}
                          onClick={() => setSelectedEvent(e)}
                          className="absolute left-1.5 right-1.5 cursor-pointer hover:z-10"
                          style={{ top, height: h }}
                        >
                          <div className={cx(
                            "group h-full rounded-xl border-2 p-3.5 transition-all hover:shadow-xl overflow-hidden",
                            eventStyles
                          )}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                {getPriorityIndicator(e.priority)}
                                <span className="text-xs font-mono font-bold truncate tracking-wide">{e.id}</span>
                              </div>
                              {isConflict && (
                                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                              )}
                            </div>

                            <div className="text-sm font-bold leading-snug line-clamp-2 mb-2.5">
                              {e.title}
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate font-medium">{e.site}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-medium">{minutesToShort(e.startMin)} - {minutesToShort(e.startMin + e.durMin)}</span>
                              </div>
                            </div>

                            {h >= 160 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {e.crew.slice(0, 2).map((c, i) => (
                                  <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-background/70 px-2 py-1 text-xs font-semibold border border-border/40">
                                    <Users className="h-3 w-3" />
                                    {c}
                                  </span>
                                ))}
                                {e.crew.length > 2 && (
                                  <span className="inline-flex items-center rounded-lg bg-background/70 px-2 py-1 text-xs font-semibold border border-border/40">
                                    +{e.crew.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {/* Drop Zone Indicator */}
                  <div className="absolute inset-x-2 bottom-2 rounded-lg border-2 border-dashed border-border/30 bg-muted/10 py-4 text-center text-xs font-medium text-muted-foreground/50">
                    Drop here
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
