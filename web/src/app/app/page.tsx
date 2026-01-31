'use client'

import Link from 'next/link'

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')
const money = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-3xl bg-slate-950/35 ring-1 ring-slate-800/80 backdrop-blur p-5', props.className)}>
      {props.children}
    </div>
  )
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

function Metric(props: { label: string; value: string; delta: string; tone: 'emerald' | 'amber' | 'rose' | 'slate' }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">{props.label}</div>
        <Pill tone={props.tone}>{props.delta}</Pill>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>
      <div className="mt-1 text-xs text-slate-400">Last 7 days</div>
    </Card>
  )
}

function Row(props: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">{props.left}</div>
      <div className="shrink-0">{props.right}</div>
    </div>
  )
}

export default function AppHome() {
  const revenue = 48210
  const hold = 26750
  const backlog = 14

  const jobs = [
    { id: 'job_3921', title: 'Rope access – façade repair', client: 'Aria Facilities', status: 'IN PROGRESS', eta: 'Today 4:00pm', tone: 'amber' as const },
    { id: 'job_3920', title: 'Strata repaint – Tower A', client: 'Bayside Owners Corp', status: 'SCHEDULED', eta: 'Mon 7:00am', tone: 'violet' as const },
    { id: 'job_3919', title: 'Emergency leak – Unit 34', client: 'S. Nguyen', status: 'COMPLETED', eta: 'Done', tone: 'emerald' as const },
    { id: 'job_3918', title: 'Ceiling patch + paint', client: 'M. Chen', status: 'DISPUTE', eta: 'Action needed', tone: 'rose' as const },
  ]

  const tasks = [
    { title: 'Approve release: esc_10088', meta: 'Hold under 72h • Risk MED', tone: 'amber' as const, href: '/app/escrow' },
    { title: 'Schedule crew: Tower A', meta: '2 techs + lift booking', tone: 'violet' as const, href: '/app/calendar' },
    { title: 'Invoice draft: job_3921', meta: 'Milestone 1 • $6,400', tone: 'emerald' as const, href: '/app/invoices' },
    { title: 'Dispute triage: dsp_2200', meta: 'Priority P0 • compliance docs', tone: 'rose' as const, href: '/app/escrow' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs ring-1 ring-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
              Operations Command
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">TradeHub HQ</h1>
            <p className="mt-2 text-sm text-slate-300">
              Built for trades: job flow, calendar, clients, invoices, team, and escrow — with audit-grade controls.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/app/jobs" className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
              View jobs
            </Link>
            <Link href="/app/calendar" className="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20">
              Open calendar
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Metric label="Revenue" value={money(revenue)} delta="↑ 9.4%" tone="emerald" />
          <Metric label="Escrow on hold" value={money(hold)} delta="Guarded" tone="amber" />
          <Metric label="Backlog" value={`${backlog} jobs`} delta="Needs scheduling" tone="slate" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Live jobs</div>
                <div className="mt-1 text-xs text-slate-400">High-signal overview — click through for full detail</div>
              </div>
              <Link href="/app/jobs" className="text-xs text-slate-300 hover:text-slate-100">Open list →</Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-800">
              <div className="grid grid-cols-12 gap-2 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">
                <div className="col-span-5">Job</div>
                <div className="col-span-3">Client</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">ETA</div>
              </div>
              <div className="divide-y divide-slate-800 bg-slate-950/40">
                {jobs.map((j) => (
                  <Link key={j.id} href={`/app/jobs/${encodeURIComponent(j.id)}`} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-slate-900/40">
                    <div className="col-span-5 truncate font-medium text-slate-100">{j.title}</div>
                    <div className="col-span-3 truncate text-slate-300">{j.client}</div>
                    <div className="col-span-2">
                      <Pill tone={j.tone}>{j.status}</Pill>
                    </div>
                    <div className="col-span-2 text-right text-slate-300">{j.eta}</div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Action queue</div>
                <div className="mt-1 text-xs text-slate-400">Ops tasks generated by rules</div>
              </div>
              <Pill tone="violet">AUTO</Pill>
            </div>

            <div className="mt-4 grid gap-2">
              {tasks.map((t, idx) => (
                <Link
                  key={idx}
                  href={t.href}
                  className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800 hover:bg-slate-900/70"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{t.title}</div>
                      <div className="mt-1 truncate text-xs text-slate-400">{t.meta}</div>
                    </div>
                    <Pill tone={t.tone}>{t.tone.toUpperCase()}</Pill>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
              <div className="text-xs text-slate-400">Next</div>
              <div className="mt-2 text-sm font-semibold">Calendar drag & drop + crew scheduling</div>
              <div className="mt-1 text-xs text-slate-400">MegaPush v2 will add scheduling lanes and live job cards.</div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="text-sm font-semibold">Operating system</div>
            <div className="mt-1 text-xs text-slate-400">Navigate core modules</div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              <Quick href="/app/calendar" title="Calendar" desc="Crew, bookings, drag/drop" />
              <Quick href="/app/jobs" title="Jobs" desc="Lifecycle + milestones" />
              <Quick href="/app/clients" title="Clients" desc="Entities + notes" />
              <Quick href="/app/invoices" title="Invoices" desc="Draft → sent → paid" />
              <Quick href="/app/team" title="Team" desc="Roles + access" />
              <Quick href="/app/escrow" title="Escrow" desc="Ledger + disputes" />
            </div>
          </Card>

          <Card>
            <div className="text-sm font-semibold">Compliance posture</div>
            <div className="mt-1 text-xs text-slate-400">Audit-grade by design</div>

            <div className="mt-4 divide-y divide-slate-800 rounded-2xl bg-slate-950/40 ring-1 ring-slate-800">
              <div className="px-4 py-3">
                <Row left={<div className="text-sm font-semibold">Immutable trails</div>} right={<Pill tone="emerald">ON</Pill>} />
                <div className="text-xs text-slate-400">Every action logged (actor, reason, timestamp)</div>
              </div>
              <div className="px-4 py-3">
                <Row left={<div className="text-sm font-semibold">Release gates</div>} right={<Pill tone="amber">ON</Pill>} />
                <div className="text-xs text-slate-400">Rules prevent risky releases</div>
              </div>
              <div className="px-4 py-3">
                <Row left={<div className="text-sm font-semibold">Dispute protocol</div>} right={<Pill tone="violet">ON</Pill>} />
                <div className="text-xs text-slate-400">Evidence → inspector → outcome enforcement</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Quick(props: { href: string; title: string; desc: string }) {
  return (
    <Link href={props.href} className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800 hover:bg-slate-900/70">
      <div className="text-sm font-semibold">{props.title}</div>
      <div className="mt-1 text-xs text-slate-400">{props.desc}</div>
    </Link>
  )
}
