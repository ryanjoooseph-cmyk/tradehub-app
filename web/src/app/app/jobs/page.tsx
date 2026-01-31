'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')

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

type Job = {
  id: string
  title: string
  client: string
  status: 'SCHEDULED' | 'IN PROGRESS' | 'COMPLETED' | 'DISPUTE'
  priority: 'P0' | 'P1' | 'P2'
  updated: string
  value: number
  tone: 'emerald' | 'amber' | 'rose' | 'violet'
}

const money = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

export default function JobsPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'ALL' | Job['status']>('ALL')
  const [priority, setPriority] = useState<'ALL' | Job['priority']>('ALL')

  const jobs: Job[] = useMemo(
    () => [
      { id: 'job_3921', title: 'Rope access – façade repair', client: 'Aria Facilities', status: 'IN PROGRESS', priority: 'P0', updated: 'Today 12:22', value: 26750, tone: 'amber' },
      { id: 'job_3920', title: 'Strata repaint – Tower A', client: 'Bayside Owners Corp', status: 'SCHEDULED', priority: 'P1', updated: 'Today 09:41', value: 18400, tone: 'violet' },
      { id: 'job_3919', title: 'Emergency leak – Unit 34', client: 'S. Nguyen', status: 'COMPLETED', priority: 'P2', updated: 'Yesterday', value: 890, tone: 'emerald' },
      { id: 'job_3918', title: 'Ceiling patch + paint', client: 'M. Chen', status: 'DISPUTE', priority: 'P0', updated: 'Yesterday', value: 1350, tone: 'rose' },
      { id: 'job_3917', title: 'Bond clean', client: 'L. O’Brien', status: 'COMPLETED', priority: 'P2', updated: '2d ago', value: 620, tone: 'emerald' },
      { id: 'job_3916', title: 'Kitchen reno stage 1', client: 'Harper Group', status: 'COMPLETED', priority: 'P1', updated: '3d ago', value: 15200, tone: 'emerald' },
    ],
    []
  )

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return jobs.filter((j) => {
      const hit =
        !qq ||
        j.id.toLowerCase().includes(qq) ||
        j.title.toLowerCase().includes(qq) ||
        j.client.toLowerCase().includes(qq)
      const st = status === 'ALL' ? true : j.status === status
      const pr = priority === 'ALL' ? true : j.priority === priority
      return hit && st && pr
    })
  }, [jobs, q, status, priority])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs ring-1 ring-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
              Job Ops
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Jobs</h1>
            <p className="mt-2 text-sm text-slate-300">Institutional-grade job tracking: priority, risk, value, and workflow status.</p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search job id, title, client…"
                className="w-full md:w-[360px] rounded-xl bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 ring-1 ring-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="pointer-events-none absolute right-3 top-2.5 text-slate-500">⌘K</div>
            </div>

            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="rounded-xl bg-slate-900/60 px-3 py-2.5 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="ALL">All status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DISPUTE">Dispute</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="rounded-xl bg-slate-900/60 px-3 py-2.5 text-sm ring-1 ring-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="ALL">All priority</option>
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>

              <button className="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">
                New job
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Job list</div>
                <div className="mt-1 text-xs text-slate-400">{filtered.length} items</div>
              </div>
              <Pill tone="violet">A++ UI</Pill>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-800">
              <div className="grid grid-cols-12 gap-2 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">
                <div className="col-span-4">Job</div>
                <div className="col-span-3">Client</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Priority</div>
                <div className="col-span-2 text-right">Value</div>
              </div>
              <div className="divide-y divide-slate-800 bg-slate-950/40">
                {filtered.map((j) => (
                  <Link key={j.id} href={`/app/jobs/${encodeURIComponent(j.id)}`} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-slate-900/40">
                    <div className="col-span-4 min-w-0">
                      <div className="truncate font-medium text-slate-100">{j.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{j.id} • updated {j.updated}</div>
                    </div>
                    <div className="col-span-3 truncate text-slate-300">{j.client}</div>
                    <div className="col-span-2"><Pill tone={j.tone}>{j.status}</Pill></div>
                    <div className="col-span-1"><Pill tone={j.priority === 'P0' ? 'rose' : j.priority === 'P1' ? 'amber' : 'slate'}>{j.priority}</Pill></div>
                    <div className="col-span-2 text-right font-semibold">{money(j.value)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-sm font-semibold">Ops intelligence</div>
            <div className="mt-1 text-xs text-slate-400">What needs attention right now</div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Priority P0</div>
                  <Pill tone="rose">2 items</Pill>
                </div>
                <div className="mt-1 text-xs text-slate-400">Dispute + rope access compliance docs</div>
              </div>

              <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Scheduling load</div>
                  <Pill tone="amber">High</Pill>
                </div>
                <div className="mt-1 text-xs text-slate-400">Crew B is overallocated next Monday</div>
              </div>

              <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Invoice leakage</div>
                  <Pill tone="violet">1 draft</Pill>
                </div>
                <div className="mt-1 text-xs text-slate-400">Milestone invoice not issued (job_3921)</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
              <div className="text-xs text-slate-400">Next</div>
              <div className="mt-2 text-sm font-semibold">Jobs detail page upgrades</div>
              <div className="mt-1 text-xs text-slate-400">Milestones, notes, photos, change orders, invoice timeline.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
