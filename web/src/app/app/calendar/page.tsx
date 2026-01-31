'use client'

import Link from 'next/link'
import { useMemo } from 'react'

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')
const pad = (n: number) => String(n).padStart(2, '0')

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
  return <div className={cn('rounded-3xl bg-slate-950/35 ring-1 ring-slate-800/80 backdrop-blur p-5', props.className)}>{props.children}</div>
}

type CalEvent = {
  id: string
  jobId: string
  title: string
  client: string
  at: string
  durMin: number
  lane: 'crew' | 'client' | 'escrow'
  tone: 'emerald' | 'amber' | 'rose' | 'violet' | 'slate'
}

export default function CalendarPage() {
  const events = useMemo<CalEvent[]>(
    () => [
      { id: 'evt_01', jobId: 'job_3921', title: 'On-site start', client: 'Aria Facilities', at: '07:00', durMin: 90, lane: 'crew', tone: 'amber' },
      { id: 'evt_02', jobId: 'job_3918', title: 'Dispute call', client: 'Strata Group QLD', at: '10:30', durMin: 45, lane: 'escrow', tone: 'rose' },
      { id: 'evt_03', jobId: 'job_3921', title: 'Milestone evidence upload', client: 'Aria Facilities', at: '12:15', durMin: 30, lane: 'client', tone: 'violet' },
      { id: 'evt_04', jobId: 'job_3919', title: 'Handover', client: 'Harbour Body Corporate', at: '15:00', durMin: 60, lane: 'client', tone: 'emerald' },
    ],
    []
  )

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => 6 + i), [])

  function topForTime(t: string) {
    const [h, m] = t.split(':').map((x) => parseInt(x, 10))
    const base = 6 * 60
    const mins = h * 60 + m
    const pct = ((mins - base) / (12 * 60)) * 100
    return Math.max(0, Math.min(100, pct))
  }

  function heightForDur(dur: number) {
    return Math.max(6, (dur / (12 * 60)) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="violet">Calendar</Pill>
                <Pill tone="slate">Today</Pill>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Job-first schedule</h1>
              <div className="mt-2 text-sm text-slate-300">Click any event to open the job command center.</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/app/jobs" className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
                Open jobs
              </Link>
              <Link href="/app/escrow" className="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">
                Escrow center
              </Link>
              <button className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
                New event
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <Card className="p-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 lg:col-span-3">
                  <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-3">
                    <div className="text-xs text-slate-400">Time</div>
                    <div className="mt-2 space-y-2">
                      {hours.map((h) => (
                        <div key={h} className="flex items-center justify-between rounded-xl bg-slate-900/35 px-3 py-2 ring-1 ring-slate-800">
                          <div className="text-sm font-semibold">{pad(h)}:00</div>
                          <div className="text-xs text-slate-400">{pad(h + 1)}:00</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-9">
                  <div className="grid gap-3 md:grid-cols-3">
                    {(['crew','client','escrow'] as const).map((lane) => (
                      <div key={lane} className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 overflow-hidden">
                        <div className="bg-slate-900/55 px-4 py-3 text-sm font-semibold">
                          {lane === 'crew' ? 'Crew ops' : lane === 'client' ? 'Client touchpoints' : 'Escrow / disputes'}
                        </div>
                        <div className="relative h-[560px] bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/40">
                          <div className="absolute inset-0 pointer-events-none">
                            {hours.map((h) => (
                              <div key={h} className="absolute left-0 right-0 border-t border-slate-800/70" style={{ top: `${((h - 6) / 12) * 100}%` }} />
                            ))}
                          </div>

                          {events
                            .filter((e) => e.lane === lane)
                            .map((e) => (
                              <Link
                                key={e.id}
                                href={`/app/jobs/${encodeURIComponent(e.jobId)}`}
                                className={cn(
                                  'absolute left-3 right-3 rounded-2xl ring-1 px-3 py-2 backdrop-blur transition hover:brightness-110',
                                  e.tone === 'emerald'
                                    ? 'bg-emerald-500/12 ring-emerald-500/25'
                                    : e.tone === 'rose'
                                    ? 'bg-rose-500/12 ring-rose-500/25'
                                    : e.tone === 'violet'
                                    ? 'bg-violet-500/12 ring-violet-500/25'
                                    : 'bg-amber-500/12 ring-amber-500/25'
                                )}
                                style={{ top: `${topForTime(e.at)}%`, height: `${heightForDur(e.durMin)}%` }}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="text-sm font-semibold leading-tight">{e.title}</div>
                                    <div className="mt-1 text-xs text-slate-300">
                                      <span className="text-slate-100 font-semibold">{e.client}</span> • {e.at} • {e.jobId}
                                    </div>
                                  </div>
                                  <Pill tone={e.tone}>{e.durMin}m</Pill>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold">Today feed</div>
              <div className="mt-2 text-xs text-slate-400">Fast list for ops.</div>

              <div className="mt-4 space-y-2">
                {events
                  .slice()
                  .sort((a, b) => (a.at < b.at ? -1 : 1))
                  .map((e) => (
                    <Link key={e.id} href={`/app/jobs/${encodeURIComponent(e.jobId)}`} className="block rounded-2xl bg-slate-900/45 ring-1 ring-slate-800 p-4 hover:bg-slate-900/65">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{e.at} • {e.title}</div>
                          <div className="mt-1 text-xs text-slate-400">
                            <span className="text-slate-200 font-semibold">{e.client}</span> • {e.jobId}
                          </div>
                        </div>
                        <Pill tone={e.tone}>{e.lane.toUpperCase()}</Pill>
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
