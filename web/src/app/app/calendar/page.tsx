'use client'

import { useMemo, useState } from 'react'

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')
const pad = (n: number) => String(n).padStart(2, '0')

type CalJob = {
  id: string
  title: string
  client: string
  start: string
  end: string
  lane: 'CREW A' | 'CREW B' | 'CREW C'
  tone: 'emerald' | 'amber' | 'violet' | 'rose'
}

function Pill(props: { tone: 'emerald' | 'amber' | 'rose' | 'violet' | 'slate'; children: React.ReactNode }) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-900/35 text-emerald-200 ring-emerald-700/60',
    amber: 'bg-amber-900/35 text-amber-200 ring-amber-700/60',
    rose: 'bg-rose-900/35 text-rose-200 ring-rose-700/60',
    violet: 'bg-violet-900/35 text-violet-200 ring-violet-700/60',
    slate: 'bg-slate-900/60 text-slate-200 ring-slate-700/70',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1 ${map[props.tone]}`}>{props.children}</span>
}

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-3xl bg-slate-950/35 ring-1 ring-slate-800/80 backdrop-blur p-5', props.className)}>
      {props.children}
    </div>
  )
}

export default function CalendarPage() {
  const [day, setDay] = useState(31)
  const jobs: CalJob[] = useMemo(
    () => [
      { id: 'job_3921', title: 'Rope access – façade repair', client: 'Aria Facilities', start: '07:00', end: '16:00', lane: 'CREW A', tone: 'amber' },
      { id: 'job_3920', title: 'Strata repaint – Tower A', client: 'Bayside Owners Corp', start: '06:30', end: '15:30', lane: 'CREW B', tone: 'violet' },
      { id: 'job_3919', title: 'Emergency leak – Unit 34', client: 'S. Nguyen', start: '09:00', end: '11:00', lane: 'CREW C', tone: 'emerald' },
      { id: 'job_3918', title: 'Ceiling patch + paint (dispute)', client: 'M. Chen', start: '12:00', end: '13:30', lane: 'CREW C', tone: 'rose' },
    ],
    []
  )

  const lanes: Array<CalJob['lane']> = ['CREW A', 'CREW B', 'CREW C']
  const hours = Array.from({ length: 12 }, (_, i) => 6 + i)

  const byLane = useMemo(() => {
    const m: Record<string, CalJob[]> = { 'CREW A': [], 'CREW B': [], 'CREW C': [] }
    for (const j of jobs) m[j.lane].push(j)
    return m
  }, [jobs])

  const toneClass = (t: CalJob['tone']) =>
    t === 'emerald'
      ? 'bg-emerald-500/12 ring-emerald-500/25 hover:bg-emerald-500/18'
      : t === 'amber'
      ? 'bg-amber-500/12 ring-amber-500/25 hover:bg-amber-500/18'
      : t === 'violet'
      ? 'bg-violet-500/12 ring-violet-500/25 hover:bg-violet-500/18'
      : 'bg-rose-500/12 ring-rose-500/25 hover:bg-rose-500/18'

  const topPct = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    const mins = (h - 6) * 60 + m
    return (mins / (12 * 60)) * 100
  }

  const heightPct = (s: string, e: string) => {
    const [sh, sm] = s.split(':').map(Number)
    const [eh, em] = e.split(':').map(Number)
    const mins = (eh * 60 + em) - (sh * 60 + sm)
    return (mins / (12 * 60)) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs ring-1 ring-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
              Scheduling
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Drag-drop calendar (v1)</h1>
            <p className="mt-2 text-sm text-slate-300">Lane-based crew scheduling with job cards. v2 adds true drag/drop + persistence.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDay((d) => Math.max(1, d - 1))} className="rounded-xl bg-slate-900/55 px-3 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
              Prev
            </button>
            <div className="rounded-xl bg-slate-900/55 px-4 py-2 text-sm ring-1 ring-slate-800">Jan {day}, 2026</div>
            <button onClick={() => setDay((d) => Math.min(31, d + 1))} className="rounded-xl bg-slate-900/55 px-3 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
              Next
            </button>
            <button className="rounded-xl bg-emerald-500/15 px-4 py-2 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">
              New job block
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_2fr]">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Crew lanes</div>
                <div className="mt-1 text-xs text-slate-400">Operational view — allocation & conflicts</div>
              </div>
              <Pill tone="violet">AUTO</Pill>
            </div>

            <div className="mt-4 grid gap-2">
              {lanes.map((l) => (
                <div key={l} className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{l}</div>
                    <Pill tone="slate">{(byLane[l] || []).length} jobs</Pill>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">Focus: schedule density + travel minimisation</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Day timeline</div>
                <div className="mt-1 text-xs text-slate-400">6:00 → 18:00 (v1 visual lanes)</div>
              </div>
              <div className="text-xs text-slate-400">Timezone: Australia/Melbourne</div>
            </div>

            <div className="mt-4 grid gap-3">
              {lanes.map((lane) => (
                <div key={lane} className="rounded-3xl bg-slate-950/40 ring-1 ring-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60">
                    <div className="text-sm font-semibold">{lane}</div>
                    <div className="text-xs text-slate-400">{(byLane[lane] || []).length} scheduled</div>
                  </div>

                  <div className="relative grid grid-cols-[80px_1fr]">
                    <div className="border-r border-slate-800 bg-slate-950/20">
                      {hours.map((h) => (
                        <div key={h} className="h-12 px-4 py-2 text-xs text-slate-500">
                          {pad(h)}:00
                        </div>
                      ))}
                    </div>

                    <div className="relative">
                      {hours.map((h) => (
                        <div key={h} className="h-12 border-b border-slate-900/50" />
                      ))}

                      {(byLane[lane] || []).map((j) => (
                        <div
                          key={j.id}
                          className={cn(
                            'absolute left-3 right-3 rounded-2xl p-3 ring-1 cursor-pointer',
                            toneClass(j.tone)
                          )}
                          style={{ top: `${topPct(j.start)}%`, height: `${heightPct(j.start, j.end)}%` }}
                          title={`${j.start}–${j.end}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{j.title}</div>
                              <div className="mt-1 truncate text-xs text-slate-400">{j.client}</div>
                            </div>
                            <Pill tone="slate">{j.start}–{j.end}</Pill>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
