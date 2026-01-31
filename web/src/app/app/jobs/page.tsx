'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')
const money = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

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

type JobRow = {
  id: string
  title: string
  client: string
  address: string
  status: 'IN PROGRESS' | 'DISPUTE' | 'COMPLETED'
  priority: 'P0' | 'P1' | 'P2'
  scheduled: string
  value: number
}

function toneForStatus(s: JobRow['status']) {
  if (s === 'COMPLETED') return 'emerald' as const
  if (s === 'DISPUTE') return 'rose' as const
  return 'amber' as const
}

function toneForPriority(p: JobRow['priority']) {
  if (p === 'P0') return 'rose' as const
  if (p === 'P1') return 'amber' as const
  return 'slate' as const
}

export default function JobsPage() {
  const [q, setQ] = useState('')

  const jobs = useMemo<JobRow[]>(
    () => [
      {
        id: 'job_3921',
        title: 'Rope access – façade repair',
        client: 'Aria Facilities',
        address: 'Brisbane CBD • Tower A',
        status: 'IN PROGRESS',
        priority: 'P1',
        scheduled: 'Today 7:00am → 4:00pm',
        value: 26750,
      },
      {
        id: 'job_3918',
        title: 'Water ingress investigation',
        client: 'Strata Group QLD',
        address: 'New Farm • Building C',
        status: 'DISPUTE',
        priority: 'P0',
        scheduled: 'Today 10:30am',
        value: 15200,
      },
      {
        id: 'job_3919',
        title: 'Balcony repaint stage 2',
        client: 'Harbour Body Corporate',
        address: 'South Bank • Level 12',
        status: 'COMPLETED',
        priority: 'P2',
        scheduled: 'Yesterday',
        value: 8800,
      },
    ],
    []
  )

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return jobs
    return jobs.filter((j) => `${j.id} ${j.title} ${j.client} ${j.address} ${j.status} ${j.priority}`.toLowerCase().includes(s))
  }, [q, jobs])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="violet">Jobs</Pill>
                <Pill tone="slate">{filtered.length} visible</Pill>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Operations board</h1>
              <div className="mt-2 text-sm text-slate-300">High-signal list. Click any row to open the job command center.</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/app/calendar" className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
                Open calendar
              </Link>
              <Link href="/app/escrow" className="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">
                Escrow center
              </Link>
              <button className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
                New job
              </button>
            </div>
          </div>

          <Card className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm font-semibold">Filter</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search jobs, clients, status…"
                className="w-full md:w-[420px] rounded-2xl bg-slate-950/60 px-4 py-3 text-sm ring-1 ring-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </Card>

          <div className="overflow-hidden rounded-3xl ring-1 ring-slate-800 bg-slate-950/35 backdrop-blur">
            <div className="grid grid-cols-12 gap-2 bg-slate-900/55 px-4 py-3 text-xs text-slate-400">
              <div className="col-span-5">Job</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Scheduled</div>
              <div className="col-span-1 text-right">Value</div>
            </div>

            <div className="divide-y divide-slate-800">
              {filtered.map((j) => (
                <Link
                  key={j.id}
                  href={`/app/jobs/${encodeURIComponent(j.id)}`}
                  className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-slate-900/40 transition"
                >
                  <div className="col-span-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{j.title}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          <span className="text-slate-200 font-semibold">{j.client}</span> • {j.address} • <span className="text-slate-500">{j.id}</span>
                        </div>
                      </div>
                      <span className="hidden md:inline-flex rounded-xl bg-slate-900/55 px-3 py-1.5 text-xs ring-1 ring-slate-800">Open</span>
                    </div>
                  </div>
                  <div className="col-span-2"><Pill tone={toneForStatus(j.status)}>{j.status}</Pill></div>
                  <div className="col-span-2"><Pill tone={toneForPriority(j.priority)}>{j.priority}</Pill></div>
                  <div className="col-span-2 text-slate-300">{j.scheduled}</div>
                  <div className="col-span-1 text-right font-semibold">{money(j.value)}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="text-sm font-semibold">Next: command-center parity</div>
              <div className="mt-2 text-xs text-slate-400">
                Jobs list + calendar now route to /app/jobs/[id]. Next pass: persist jobs/events from Supabase.
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold">Fast actions</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/app/dashboard" className="rounded-xl bg-slate-900/55 px-4 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">Dashboard</Link>
                <Link href="/app/clients" className="rounded-xl bg-slate-900/55 px-4 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">Clients</Link>
                <Link href="/app/invoices" className="rounded-xl bg-slate-900/55 px-4 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">Invoices</Link>
                <Link href="/app/team" className="rounded-xl bg-slate-900/55 px-4 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">Team</Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
