"use client";

import React from "react";
import Link from "next/link";
import { Card, GhostButton, PageHeader, PageWrap, Pill, PrimaryButton, cx } from "@/components/app/filled/page";
import { ChevronLeft, ChevronRight, GripVertical, Calendar as CalendarIcon, Sparkles, Clock, MapPin, Users, AlertTriangle, X, Search, Filter, CheckCircle, ExternalLink, Edit3, Copy, Check, Save } from "lucide-react";

type EventStatus = "scheduled" | "in-progress" | "completed";
type EventPriority = "normal" | "high" | "urgent";

type EventItem = {
  id: string;
  title: string;
  client: string;
  site: string;
  day: number; // 0..6
  startMin: number; // minutes from 0:00
  durMin: number;
  crew: string[];
  status: EventStatus;
  priority: EventPriority;
  notes?: string;
};

type BacklogItem = {
  id: string;
  title: string;
  crew: string[] | null;
  site: string;
  priority: EventPriority;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

// Professional seeded data - optimized for readability and spacing
const initialEvents: EventItem[] = [
  // Monday
  { id: 'J-1403', title: 'High-rise touch-up', client: 'Carlton Strata', site: 'CBD', day: 0, startMin: 9 * 60, durMin: 240, crew: ['Crew B'], status: 'scheduled', priority: 'normal', notes: 'Access via loading dock. Contact building manager on arrival.' },
  { id: 'J-1421', title: 'Balcony inspection', client: 'Richmond Owners', site: 'Richmond', day: 0, startMin: 14 * 60, durMin: 180, crew: ['QA'], status: 'scheduled', priority: 'high', notes: 'Photo documentation required for all balconies.' },

  // Tuesday
  { id: 'J-1404', title: 'Balcony sealing', client: 'Bayside Strata', site: 'St Kilda', day: 1, startMin: 9 * 60, durMin: 240, crew: ['Crew A'], status: 'completed', priority: 'normal', notes: 'Weather permitting. Reschedule if rain forecast.' },
  { id: 'J-1422', title: 'Roof repairs', client: 'South Yarra', site: 'South Yarra', day: 1, startMin: 13 * 60 + 30, durMin: 210, crew: ['Crew C'], status: 'in-progress', priority: 'high', notes: 'Safety harnesses mandatory. Check equipment before starting.' },
  { id: 'J-1424', title: 'QA walkthrough', client: 'Prahran Mgmt', site: 'Prahran', day: 1, startMin: 17 * 60, durMin: 90, crew: ['QA', 'Ryan J'], status: 'scheduled', priority: 'urgent', notes: 'Final sign-off required for milestone release.' },

  // Wednesday
  { id: 'J-1406', title: 'Heritage restoration', client: 'South Yarra Owners', site: 'South Yarra', day: 2, startMin: 8 * 60, durMin: 360, crew: ['Ryan J', 'Crew C'], status: 'scheduled', priority: 'urgent', notes: 'Heritage overlay requirements. Use approved materials only.' },
  { id: 'J-1425', title: 'Facade cleaning', client: 'Brighton Towers', site: 'Brighton', day: 2, startMin: 15 * 60, durMin: 180, crew: ['Crew A'], status: 'scheduled', priority: 'normal' },

  // Thursday
  { id: 'J-1402', title: 'Tower A repaint', client: 'Acme Body Corp', site: 'Southbank', day: 3, startMin: 8 * 60, durMin: 300, crew: ['Ryan J', 'Crew A'], status: 'in-progress', priority: 'high', notes: 'Multi-day job. Progress photos at end of each day.' },
  { id: 'J-1427', title: 'Safety inspection', client: 'Docklands Tower', site: 'Docklands', day: 3, startMin: 14 * 60, durMin: 180, crew: ['QA'], status: 'scheduled', priority: 'urgent', notes: 'Compliance audit. All documentation ready.' },

  // Friday
  { id: 'J-1429', title: 'Waterproofing', client: 'Brunswick Dev', site: 'Brunswick', day: 4, startMin: 8 * 60, durMin: 300, crew: ['Crew A', 'Crew C'], status: 'in-progress', priority: 'high' },
  { id: 'J-1408', title: 'Roof deck repair', client: 'Docklands Mgmt', site: 'Docklands', day: 4, startMin: 14 * 60, durMin: 180, crew: ['QA', 'Crew B'], status: 'scheduled', priority: 'normal' },
  { id: 'J-1442', title: 'Final inspection', client: 'Reservoir Mgmt', site: 'Reservoir', day: 4, startMin: 17 * 60, durMin: 90, crew: ['Ryan J'], status: 'scheduled', priority: 'high' },

  // Saturday
  { id: 'J-1409', title: 'Façade inspection', client: 'Melbourne Property', site: 'Richmond', day: 5, startMin: 9 * 60, durMin: 240, crew: ['Ryan J'], status: 'scheduled', priority: 'high' },
  { id: 'J-1431', title: 'Emergency repair', client: 'CBD Strata', site: 'CBD', day: 5, startMin: 14 * 60, durMin: 180, crew: ['Crew A', 'QA'], status: 'scheduled', priority: 'urgent', notes: 'Water ingress reported. Immediate response required.' },

  // Sunday
  { id: 'J-1411', title: 'Strata QA check', client: 'Brunswick Estates', site: 'Brunswick', day: 6, startMin: 10 * 60, durMin: 180, crew: ['QA'], status: 'completed', priority: 'normal' },
  { id: 'J-1433', title: 'Final walkthrough', client: 'Northcote Owners', site: 'Northcote', day: 6, startMin: 14 * 60, durMin: 150, crew: ['Ryan J', 'QA'], status: 'scheduled', priority: 'high' },

  // Early morning slots for completeness
  { id: 'J-1434', title: 'Site prep', client: 'Kew Property', site: 'Kew', day: 0, startMin: 7 * 60, durMin: 120, crew: ['Crew C'], status: 'completed', priority: 'normal' },
  { id: 'J-1435', title: 'Material setup', client: 'Hawthorn Strata', site: 'Hawthorn', day: 2, startMin: 7 * 60, durMin: 60, crew: ['Crew B'], status: 'completed', priority: 'normal' },
  { id: 'J-1438', title: 'Equipment check', client: 'Footscray Dev', site: 'Footscray', day: 4, startMin: 7 * 60, durMin: 90, crew: ['Crew C'], status: 'completed', priority: 'normal' },
];

// Seeded backlog (unscheduled)
const initialBacklog: BacklogItem[] = [
  { id: 'J-1405', title: 'QA inspection', crew: null, site: 'Docklands', priority: 'normal' },
  { id: 'J-1410', title: 'Paint touch-up', crew: null, site: 'Preston', priority: 'high' },
  { id: 'J-1412', title: 'Window sealing', crew: null, site: 'Footscray', priority: 'urgent' },
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
  event: EventItem;
  onClose: () => void;
  onUpdate: (updated: EventItem) => void;
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

  // Generate time options (every 30 min from 6am to 8pm)
  const timeOptions = React.useMemo(() => {
    const options: { value: number; label: string }[] = [];
    for (let m = 6 * 60; m <= 20 * 60; m += 30) {
      options.push({ value: m, label: minutesToFull(m) });
    }
    return options;
  }, []);

  // Duration options
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border bg-card shadow-2xl">
        {/* Header */}
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
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Title */}
          <div>
            <h3 className="text-xl font-bold leading-tight">{event.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{event.client}</p>
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

          {/* Details Grid */}
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

              {/* Crew */}
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

              {/* Notes */}
              {event.notes && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.notes}</p>
                </div>
              )}
            </>
          ) : (
            /* Edit Mode */
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

          {/* Conflict Warning */}
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

          {/* Priority Badge */}
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

        {/* Footer Actions */}
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

export default function CalendarPage() {
  const startDayMin = 7 * 60;
  const endDayMin = 19 * 60;
  const stepMin = 30;

  const [view, setView] = React.useState<"day" | "week" | "month">("week");
  const [focusDay, setFocusDay] = React.useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  const [events, setEvents] = React.useState<EventItem[]>(initialEvents);
  const [backlog] = React.useState<BacklogItem[]>(initialBacklog);

  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<EventStatus | 'all'>('all');
  const [crewFilter, setCrewFilter] = React.useState<string | 'all'>('all');
  const [toast, setToast] = React.useState<string | null>(null);

  const gridDays = view === "day" ? [focusDay] : view === "week" ? days.map((_, i) => i) : [];

  const rows = Math.ceil((endDayMin - startDayMin) / stepMin);
  const pxPerStep = 56; // Premium spacing for professional look
  const gridHeight = rows * pxPerStep;

  // Get all unique crews
  const allCrews = React.useMemo(() => {
    const crewSet = new Set<string>();
    events.forEach(e => e.crew.forEach(c => crewSet.add(c)));
    return Array.from(crewSet).sort();
  }, [events]);

  // Detect conflicts (overlapping jobs for same crew)
  const hasConflict = (event: EventItem): boolean => {
    const eventEnd = event.startMin + event.durMin;
    return events.some(other => {
      if (other.id === event.id || other.day !== event.day) return false;
      const otherEnd = other.startMin + other.durMin;
      const timeOverlap = event.startMin < otherEnd && eventEnd > other.startMin;
      const crewOverlap = event.crew.some(c => other.crew.includes(c));
      return timeOverlap && crewOverlap;
    });
  };

  // Filter events
  const filteredEvents = React.useMemo(() => {
    let result = events;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.id.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.client.toLowerCase().includes(q) ||
        e.site.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(e => e.status === statusFilter);
    }

    // Crew filter
    if (crewFilter !== 'all') {
      result = result.filter(e => e.crew.includes(crewFilter));
    }

    return result;
  }, [events, searchQuery, statusFilter, crewFilter]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent, day: number, startMin: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    const event = events.find(ev => ev.id === id);
    if (!event) return;

    const oldDay = days[event.day];
    const newDay = days[day];
    const newTime = minutesToFull(startMin);

    setEvents((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, day, startMin: clamp(Math.round(startMin / stepMin) * stepMin, startDayMin, endDayMin - stepMin) }
          : x
      )
    );

    showToast(`${event.id} rescheduled from ${oldDay} to ${newDay} at ${newTime}`);
  };

  const handleUpdateEvent = (updated: EventItem) => {
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
    const duplicated: EventItem = {
      ...selectedEvent,
      id: newId,
      status: 'scheduled',
    };
    setEvents(prev => [...prev, duplicated]);
    showToast(`Created duplicate: ${newId}`);
  };

  const goToToday = () => {
    const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    setFocusDay(today);
  };

  const slots = Array.from({ length: rows + 1 }, (_, i) => startDayMin + i * stepMin);
  const visibleEvents = filteredEvents.filter((ev) => gridDays.includes(ev.day));
  const conflictCount = events.filter(hasConflict).length;
  const inProgressCount = events.filter(e => e.status === 'in-progress').length;
  const highPriorityCount = events.filter(e => e.priority === 'high' || e.priority === 'urgent').length;

  return (
    <PageWrap>
      <PageHeader
        title="Calendar"
        subtitle="Enterprise scheduler with real-time conflict detection"
        right={
          <div className="flex items-center gap-2">
            <GhostButton onClick={goToToday}>
              <CalendarIcon className="h-4 w-4" />
              Today
            </GhostButton>
            <PrimaryButton>New booking</PrimaryButton>
          </div>
        }
      />

      {/* Toast Notification */}
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

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Panel */}
        <div className="space-y-4">
          {/* Week Controls */}
          <div className="rounded-2xl border bg-card/50 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-3.5">
              <div>
                <div className="text-sm font-semibold">Week Controls</div>
                <div className="text-xs text-muted-foreground">Navigate & filter</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                  type="button"
                  title="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                  type="button"
                  title="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* View Toggles */}
              <div className="flex gap-1 rounded-lg bg-muted/30 p-1">
                {(['day', 'week', 'month'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cx(
                      "flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all",
                      view === v
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs..."
                  className="w-full rounded-lg border bg-background py-2 pl-10 pr-3 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ring/20"
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted/20 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold">Jobs</div>
                  <div className="mt-1.5 text-xl font-bold">{events.length}</div>
                </div>
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-blue-600/70 dark:text-blue-400/70 font-semibold">Active</div>
                  <div className="mt-1.5 text-xl font-bold text-blue-600 dark:text-blue-400">{inProgressCount}</div>
                </div>
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-amber-600/70 dark:text-amber-400/70 font-semibold">Priority</div>
                  <div className="mt-1.5 text-xl font-bold text-amber-600 dark:text-amber-400">{highPriorityCount}</div>
                </div>
                <div className={cx("rounded-xl p-3", conflictCount > 0 ? "bg-red-50 dark:bg-red-950/30" : "bg-emerald-50 dark:bg-emerald-950/30")}>
                  <div className={cx("text-[11px] uppercase tracking-wide font-semibold", conflictCount > 0 ? "text-red-600/70 dark:text-red-400/70" : "text-emerald-600/70 dark:text-emerald-400/70")}>Conflicts</div>
                  <div className={cx("mt-1.5 text-xl font-bold", conflictCount > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                    {conflictCount}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold">
                  <Filter className="h-3 w-3" />
                  Filters
                </div>

                {/* Status Filter */}
                <div className="mb-3">
                  <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Status</div>
                  <div className="flex flex-wrap gap-1">
                    {(['all', 'scheduled', 'in-progress', 'completed'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={cx(
                          "rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
                          statusFilter === s
                            ? "bg-foreground text-background shadow-sm"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crew Filter */}
                <div>
                  <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Crew</div>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setCrewFilter('all')}
                      className={cx(
                        "rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
                        crewFilter === 'all'
                          ? "bg-foreground text-background shadow-sm"
                          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      All
                    </button>
                    {allCrews.map((crew) => (
                      <button
                        key={crew}
                        onClick={() => setCrewFilter(crew)}
                        className={cx(
                          "rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
                          crewFilter === crew
                            ? "bg-foreground text-background shadow-sm"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {crew}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day Selector (Day View) */}
              {view === "day" && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold">Select Day</div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFocusDay(i)}
                        className={cx(
                          "rounded-lg py-2 text-xs font-semibold transition-all",
                          i === focusDay
                            ? "bg-foreground text-background shadow-sm"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Legend */}
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold">Legend</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3.5 w-3.5 rounded border-2 border-blue-400/60 bg-blue-50 dark:bg-blue-950/30" />
                    <span className="text-muted-foreground font-medium">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3.5 w-3.5 rounded border-2 border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/30" />
                    <span className="text-muted-foreground font-medium">Completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3.5 w-3.5 rounded border-2 border-amber-400/60 bg-amber-50 dark:bg-amber-950/30" />
                    <span className="text-muted-foreground font-medium">High Priority</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3.5 w-3.5 rounded border-2 border-rose-400/60 bg-rose-50 dark:bg-rose-950/30" />
                    <span className="text-muted-foreground font-medium">Urgent</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-3.5 w-3.5 rounded border-2 border-red-500/60 bg-red-50 dark:bg-red-950/40" />
                    <span className="text-muted-foreground font-medium">Conflict</span>
                  </div>
                </div>
              </div>

              {/* Smart Scheduling */}
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-3 ring-1 ring-violet-500/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                    <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">AI Scheduling</div>
                    <div className="text-[11px] text-muted-foreground">Auto-optimize</div>
                  </div>
                </div>
                <Pill tone="good">Active</Pill>
              </div>
            </div>
          </div>

          {/* Backlog */}
          <div className="rounded-2xl border bg-card/50 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-3.5">
              <div>
                <div className="text-sm font-semibold">Backlog</div>
                <div className="text-xs text-muted-foreground">{backlog.length} unscheduled</div>
              </div>
            </div>

            <div className="p-3 space-y-2">
              {backlog.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", JSON.stringify({
                      isBacklog: true,
                      id: item.id,
                      title: item.title,
                      crew: item.crew || [],
                      site: item.site,
                      client: 'Unassigned',
                    }));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  className={cx(
                    "group flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-grab active:cursor-grabbing",
                    "bg-background hover:bg-muted/30 hover:border-border hover:shadow-sm",
                    item.priority === 'urgent' && "border-rose-400/30 bg-rose-50/50 dark:bg-rose-950/20",
                    item.priority === 'high' && "border-amber-400/30 bg-amber-50/50 dark:bg-amber-950/20"
                  )}
                >
                  <div className="mt-0.5 text-muted-foreground/40 group-hover:text-muted-foreground/60">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {getPriorityIndicator(item.priority)}
                      <span className="text-xs font-mono font-semibold text-muted-foreground">{item.id}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold leading-tight">{item.title}</div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {item.site}
                    </div>
                  </div>
                </div>
              ))}

              {backlog.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No unscheduled jobs
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-4">
          {view === 'month' ? (
            <div className="rounded-2xl border bg-card/50 p-8 shadow-sm">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="mt-4 text-lg font-semibold">Month View</div>
                <div className="mt-2 text-sm text-muted-foreground">Coming in the next release</div>
                <button
                  onClick={() => setView('week')}
                  className="mt-6 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
                >
                  Use Week View
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border bg-card/50 overflow-hidden shadow-sm">
              {/* Header */}
              <div className={cx(
                "grid border-b bg-muted/20",
                view === 'day' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[80px_repeat(7,minmax(0,1fr))]'
              )}>
                <div className="flex items-center justify-center border-r py-4 bg-muted/10">
                  <Clock className="h-4 w-4 text-muted-foreground/50" />
                </div>
                {gridDays.map((i) => {
                  const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                  return (
                    <div
                      key={i}
                      className={cx(
                        "flex flex-col items-center justify-center border-r py-4 last:border-r-0",
                        isToday && "bg-foreground/5"
                      )}
                    >
                      <div className="text-xs uppercase tracking-wide text-muted-foreground/70 font-semibold">
                        {view === 'day' ? fullDays[i] : days[i]}
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
              <div className={cx(
                "grid",
                view === 'day' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[80px_repeat(7,minmax(0,1fr))]'
              )}>
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
                {gridDays.map((d) => {
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
                      {visibleEvents
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
                              onDragStart={(ev) => onDragStart(ev, e.id)}
                              onClick={() => setSelectedEvent(e)}
                              className="absolute left-1.5 right-1.5 cursor-pointer hover:z-10"
                              style={{ top, height: h }}
                            >
                              <div className={cx(
                                "group h-full rounded-xl border-2 p-3.5 transition-all hover:shadow-xl overflow-hidden",
                                eventStyles
                              )}>
                                {/* Header Row */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {getPriorityIndicator(e.priority)}
                                    <span className="text-xs font-mono font-bold truncate tracking-wide">{e.id}</span>
                                  </div>
                                  {isConflict && (
                                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                                  )}
                                </div>

                                {/* Title */}
                                <div className="text-sm font-bold leading-snug line-clamp-2 mb-2.5">
                                  {e.title}
                                </div>

                                {/* Details */}
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

                                {/* Crew Pills */}
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
                        Drop event here
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conflict Engine Card - Below Calendar on smaller screens */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Conflict Engine" subtitle="Real-time overlap detection">
              <div className="space-y-3">
                <div className={cx(
                  "flex items-center justify-between rounded-xl p-3.5 ring-1",
                  conflictCount > 0 ? "bg-red-50 dark:bg-red-950/30 ring-red-500/20" : "bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-500/20"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cx(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      conflictCount > 0 ? "bg-red-500/20" : "bg-emerald-500/20"
                    )}>
                      <AlertTriangle className={cx(
                        "h-4 w-4",
                        conflictCount > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                      )} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Crew Overlaps</div>
                      <div className="text-xs text-muted-foreground">
                        {conflictCount > 0 ? `${conflictCount} conflict${conflictCount > 1 ? 's' : ''} detected` : 'All clear'}
                      </div>
                    </div>
                  </div>
                  <Pill tone={conflictCount > 0 ? 'bad' : 'good'}>
                    {conflictCount > 0 ? 'Review' : 'OK'}
                  </Pill>
                </div>
              </div>
            </Card>

            <Card title="Quick Actions" subtitle="Scheduling shortcuts">
              <div className="space-y-2">
                {[
                  { title: 'Auto-fill week', desc: 'AI-optimized slot suggestions' },
                  { title: 'Export schedule', desc: 'PDF for crews & clients' },
                  { title: 'Lock schedule', desc: 'Prevent accidental edits' },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="flex w-full items-center justify-between rounded-xl border bg-background px-3.5 py-3 text-left transition-all hover:bg-muted/30"
                  >
                    <div>
                      <div className="text-sm font-semibold">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
