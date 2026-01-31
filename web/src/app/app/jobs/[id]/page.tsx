'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

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
  return (
    <div className={cn('rounded-3xl bg-slate-950/35 ring-1 ring-slate-800/80 backdrop-blur p-5', props.className)}>
      {props.children}
    </div>
  )
}

function SectionTitle(props: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-semibold">{props.title}</div>
        {props.sub ? <div className="mt-1 text-xs text-slate-400">{props.sub}</div> : null}
      </div>
      {props.right}
    </div>
  )
}

type Milestone = { id: string; title: string; amount: number; status: 'DRAFT' | 'APPROVED' | 'RELEASED' | 'BLOCKED'; tone: 'slate' | 'amber' | 'emerald' | 'rose' }
type Timeline = { at: string; title: string; meta: string; tone: 'slate' | 'amber' | 'emerald' | 'rose' | 'violet' }

export default function JobDetailPage() {
  const params = useParams<{ id: string }>()
  const jobId = decodeURIComponent(params?.id ?? 'job_unknown')

  const [tab, setTab] = useState<'overview' | 'milestones' | 'notes' | 'media'>('overview')

  const job = useMemo(
    () => ({
      id: jobId,
      title: jobId === 'job_3921' ? 'Rope access – façade repair' : 'Job command center',
      client: jobId === 'job_3921' ? 'Aria Facilities' : 'Client',
      address: 'Brisbane CBD • Tower A',
      status: jobId === 'job_3918' ? 'DISPUTE' : jobId === 'job_3919' ? 'COMPLETED' : 'IN PROGRESS',
      priority: jobId === 'job_3918' ? 'P0' : 'P1',
      value: jobId === 'job_3921' ? 26750 : 15200,
      crew: ['Crew A', 'J. Smith', 'R. Patel'],
      window: 'Today 7:00am → 4:00pm',
      escrowRef: 'esc_10088',
      disputeRef: jobId === 'job_3918' ? 'dsp_2200' : (null as string | null),
    }),
    [jobId]
  )

  const statusTone =
    job.status === 'COMPLETED' ? ('emerald' as const) : job.status === 'DISPUTE' ? ('rose' as const) : ('amber' as const)

  const milestones: Milestone[] = useMemo(
    () => [
      { id: 'ms_01', title: 'Deposit / booking', amount: Math.round(job.value * 0.25), status: 'RELEASED', tone: 'emerald' },
      { id: 'ms_02', title: 'Milestone 1', amount: Math.round(job.value * 0.40), status: 'APPROVED', tone: 'amber' },
      { id: 'ms_03', title: 'Final / handover', amount: Math.round(job.value * 0.35), status: job.disputeRef ? 'BLOCKED' : 'DRAFT', tone: job.disputeRef ? 'rose' : 'slate' },
    ],
    [job.value, job.disputeRef]
  )

  const timeline: Timeline[] = useMemo(
    () => [
      { at: 'Today 06:12', title: 'Crew scheduled', meta: 'Crew A allocated • travel optimized', tone: 'violet' },
      { at: 'Today 07:03', title: 'Job started', meta: 'On-site check-in logged', tone: 'amber' },
      { at: 'Today 10:24', title: 'Milestone 1 requested', meta: `${money(Math.round(job.value * 0.40))} • evidence attached`, tone: 'amber' },
      ...(job.disputeRef ? [{ at: 'Today 12:02', title: 'Dispute opened', meta: `${job.disputeRef} • requires inspector`, tone: 'rose' as const }] : []),
      { at: 'Yesterday', title: 'Client approved scope', meta: 'Signed digitally • audit trail stored', tone: 'emerald' },
    ],
    [job.value, job.disputeRef]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/app/jobs" className="rounded-xl bg-slate-900/55 px-3 py-1.5 text-xs ring-1 ring-slate-800 hover:bg-slate-900/80">
                  ← Jobs
                </Link>
                <Pill tone={statusTone}>{job.status}</Pill>
                <Pill tone={job.priority === 'P0' ? 'rose' : job.priority === 'P1' ? 'amber' : 'slate'}>{job.priority}</Pill>
                <Pill tone="slate">{job.id}</Pill>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight">{job.title}</h1>
              <div className="mt-2 text-sm text-slate-300">
                <span className="font-semibold text-slate-100">{job.client}</span> • {job.address} • {job.window}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/app/calendar" className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
                Open calendar
              </Link>
              <Link href="/app/invoices" className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
                Invoice
              </Link>
              <Link href="/app/escrow" className="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">
                Escrow
              </Link>
              {job.disputeRef ? (
                <Link href="/app/escrow" className="rounded-xl bg-rose-500/12 px-4 py-2.5 text-sm ring-1 ring-rose-500/25 hover:bg-rose-500/18">
                  Dispute
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setTab('overview')} className={cn('rounded-xl px-4 py-2 text-sm ring-1', tab === 'overview' ? 'bg-slate-900/80 ring-slate-700' : 'bg-slate-900/45 ring-slate-800 hover:bg-slate-900/70')}>Overview</button>
                  <button onClick={() => setTab('milestones')} className={cn('rounded-xl px-4 py-2 text-sm ring-1', tab === 'milestones' ? 'bg-slate-900/80 ring-slate-700' : 'bg-slate-900/45 ring-slate-800 hover:bg-slate-900/70')}>Milestones</button>
                  <button onClick={() => setTab('notes')} className={cn('rounded-xl px-4 py-2 text-sm ring-1', tab === 'notes' ? 'bg-slate-900/80 ring-slate-700' : 'bg-slate-900/45 ring-slate-800 hover:bg-slate-900/70')}>Notes</button>
                  <button onClick={() => setTab('media')} className={cn('rounded-xl px-4 py-2 text-sm ring-1', tab === 'media' ? 'bg-slate-900/80 ring-slate-700' : 'bg-slate-900/45 ring-slate-800 hover:bg-slate-900/70')}>Photos</button>
                </div>
                <Pill tone="violet">Command Center</Pill>
              </div>

              {tab === 'overview' ? (
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <Metric label="Job value" value={money(job.value)} tone="emerald" />
                  <Metric label="Escrow ref" value={job.escrowRef} tone="amber" />
                  <Metric label="Crew" value={`${job.crew.length} assigned`} tone="violet" />

                  <div className="md:col-span-3 rounded-3xl bg-slate-950/40 ring-1 ring-slate-800 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-900/60 text-sm font-semibold">Timeline</div>
                    <div className="divide-y divide-slate-800">
                      {timeline.map((t, idx) => (
                        <div key={idx} className="px-4 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold">{t.title}</div>
                              <div className="mt-1 text-xs text-slate-400">{t.meta}</div>
                            </div>
                            <Pill tone={t.tone === 'violet' ? 'violet' : t.tone === 'emerald' ? 'emerald' : t.tone === 'rose' ? 'rose' : 'amber'}>{t.at}</Pill>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3 grid gap-3 md:grid-cols-2">
                    <Card className="p-4">
                      <SectionTitle title="Scope" sub="What we’re delivering" right={<Pill tone="slate">v1</Pill>} />
                      <div className="mt-3 text-sm text-slate-300">
                        High-rise works with safety compliance, access plan, and staged approvals. Evidence is attached per milestone.
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Pill tone="emerald">Audit trail</Pill>
                        <Pill tone="amber">Release gates</Pill>
                        <Pill tone="violet">Scheduling lanes</Pill>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <SectionTitle title="Risk & compliance" sub="Guardrails that prevent bad releases" right={<Pill tone="amber">ON</Pill>} />
                      <div className="mt-3 grid gap-2 text-sm">
                        <div className="flex items-center justify-between rounded-2xl bg-slate-900/45 px-4 py-3 ring-1 ring-slate-800">
                          <div className="font-semibold">Evidence required</div>
                          <Pill tone="emerald">PASS</Pill>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-900/45 px-4 py-3 ring-1 ring-slate-800">
                          <div className="font-semibold">Client approval</div>
                          <Pill tone="emerald">PASS</Pill>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-900/45 px-4 py-3 ring-1 ring-slate-800">
                          <div className="font-semibold">Dispute state</div>
                          <Pill tone={job.disputeRef ? 'rose' : 'emerald'}>{job.disputeRef ? 'BLOCKED' : 'CLEAR'}</Pill>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : null}

              {tab === 'milestones' ? (
                <div className="mt-5">
                  <SectionTitle title="Milestones" sub="Escrow control surface" right={<Pill tone="amber">Escrow-linked</Pill>} />
                  <div className="mt-4 overflow-hidden rounded-3xl ring-1 ring-slate-800 bg-slate-950/40">
                    <div className="grid grid-cols-12 gap-2 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
                      <div className="col-span-6">Milestone</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-3 text-right">Amount</div>
                    </div>
                    <div className="divide-y divide-slate-800">
                      {milestones.map((m) => (
                        <div key={m.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-slate-900/40">
                          <div className="col-span-6">
                            <div className="font-semibold">{m.title}</div>
                            <div className="mt-1 text-xs text-slate-500">{m.id}</div>
                          </div>
                          <div className="col-span-3"><Pill tone={m.tone}>{m.status}</Pill></div>
                          <div className="col-span-3 text-right font-semibold">{money(m.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === 'notes' ? (
                <div className="mt-5">
                  <SectionTitle title="Notes" sub="v3 adds persistence" right={<Pill tone="slate">Local</Pill>} />
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-3xl bg-slate-900/45 ring-1 ring-slate-800 p-4">
                      <div className="text-sm font-semibold">Add note</div>
                      <textarea className="mt-3 w-full rounded-2xl bg-slate-950/60 px-4 py-3 text-sm ring-1 ring-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" placeholder="Write a note…" rows={4} />
                      <div className="mt-3 flex justify-end">
                        <button className="rounded-xl bg-emerald-500/15 px-4 py-2 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === 'media' ? (
                <div className="mt-5">
                  <SectionTitle title="Photos & evidence" sub="v3 adds upload" right={<Pill tone="violet">Roadmap</Pill>} />
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-3xl bg-slate-950/40 ring-1 ring-slate-800 overflow-hidden">
                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
                        <div className="p-4">
                          <div className="text-sm font-semibold">Evidence {i + 1}</div>
                          <div className="mt-1 text-xs text-slate-400">Attach to milestone • audit stamp</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>

            <Card>
              <SectionTitle title="Controls" sub="High-signal actions only" right={<Pill tone="amber">Guarded</Pill>} />
              <div className="mt-4 grid gap-2">
                <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Escrow</div>
                      <div className="mt-1 text-xs text-slate-400">{job.escrowRef}</div>
                    </div>
                    <Link href="/app/escrow" className="rounded-xl bg-emerald-500/15 px-3 py-2 text-xs ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">Open</Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric(props: { label: string; value: string; tone: 'emerald' | 'amber' | 'rose' | 'violet' | 'slate' }) {
  const t =
    props.tone === 'emerald'
      ? 'bg-emerald-500/10 ring-emerald-500/20'
      : props.tone === 'amber'
      ? 'bg-amber-500/10 ring-amber-500/20'
      : props.tone === 'rose'
      ? 'bg-rose-500/10 ring-rose-500/20'
      : props.tone === 'violet'
      ? 'bg-violet-500/10 ring-violet-500/20'
      : 'bg-slate-500/10 ring-slate-500/20'

  return (
    <div className={cn('rounded-3xl p-4 ring-1', t)}>
      <div className="text-xs text-slate-400">{props.label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>
    </div>
  )
}
