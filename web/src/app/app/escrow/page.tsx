'use client'

import { useMemo, useState } from 'react'

type LedgerStatus = 'HOLD' | 'RELEASED' | 'DISPUTED' | 'REFUNDED'
type Risk = 'LOW' | 'MED' | 'HIGH'
type PayMethod = 'CARD' | 'BANK' | 'PAYID'

type LedgerRow = {
  id: string
  createdAt: string
  job: string
  client: string
  status: LedgerStatus
  amount: number
  method: PayMethod
  risk: Risk
  ref: string
  slaHoursLeft: number
}

type DisputeState = 'OPEN' | 'INVESTIGATING' | 'AWAITING_CLIENT' | 'AWAITING_TEAM' | 'RESOLVED'
type DisputePriority = 'P0' | 'P1' | 'P2'

type DisputeRow = {
  id: string
  openedAt: string
  job: string
  client: string
  priority: DisputePriority
  reason: string
  state: DisputeState
  amount: number
  escrowId: string
}

const money = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')

const badge = (tone: 'slate' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan') => {
  const map: Record<string, string> = {
    slate: 'bg-slate-900/60 text-slate-200 ring-slate-700/70',
    emerald: 'bg-emerald-900/40 text-emerald-200 ring-emerald-700/60',
    amber: 'bg-amber-900/40 text-amber-200 ring-amber-700/60',
    rose: 'bg-rose-900/40 text-rose-200 ring-rose-700/60',
    violet: 'bg-violet-900/40 text-violet-200 ring-violet-700/60',
    cyan: 'bg-cyan-900/35 text-cyan-200 ring-cyan-700/60',
  }
  return `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ${map[tone]}`
}

const statusTone = (s: LedgerStatus) => {
  if (s === 'RELEASED') return 'emerald'
  if (s === 'HOLD') return 'amber'
  if (s === 'DISPUTED') return 'rose'
  return 'slate'
}

const riskTone = (r: Risk) => (r === 'HIGH' ? 'rose' : r === 'MED' ? 'amber' : 'emerald')

const prioTone = (p: DisputePriority) => (p === 'P0' ? 'rose' : p === 'P1' ? 'amber' : 'slate')

const stateTone = (s: DisputeState) => {
  if (s === 'RESOLVED') return 'emerald'
  if (s === 'INVESTIGATING') return 'violet'
  if (s === 'AWAITING_TEAM') return 'amber'
  if (s === 'AWAITING_CLIENT') return 'cyan'
  return 'rose'
}

function Panel(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-3xl bg-slate-950/30 p-5 ring-1 ring-slate-800/80 backdrop-blur', props.className)}>
      {props.children}
    </div>
  )
}

function Tab(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      className={cn(
        'rounded-2xl px-4 py-2 text-sm ring-1 transition',
        props.active
          ? 'bg-emerald-500/15 ring-emerald-500/30 text-emerald-100'
          : 'bg-slate-900/50 ring-slate-800 text-slate-200 hover:bg-slate-900/70'
      )}
    >
      {props.children}
    </button>
  )
}

function Kpi(props: { title: string; value: string; subtitle: string; tone: 'emerald' | 'amber' | 'rose' | 'slate' }) {
  return (
    <div className="rounded-3xl bg-slate-950/30 p-4 ring-1 ring-slate-800/80 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">{props.title}</div>
        <span className={badge(props.tone)}>{props.tone.toUpperCase()}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>
      <div className="mt-1 text-xs text-slate-400">{props.subtitle}</div>
    </div>
  )
}

function Signal(props: { title: string; value: string; desc: string; tone: 'emerald' | 'amber' | 'rose' | 'violet' }) {
  return (
    <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">{props.title}</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{props.value}</div>
          <div className="mt-1 text-xs text-slate-400">{props.desc}</div>
        </div>
        <span className={badge(props.tone)}>{props.tone.toUpperCase()}</span>
      </div>
    </div>
  )
}

function Drawer(props: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className={cn('fixed inset-0 z-50', props.open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div
        onClick={props.onClose}
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity',
          props.open ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-xl transform bg-slate-950/95 p-6 ring-1 ring-slate-800/80 backdrop-blur transition',
          props.open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {props.children}
      </div>
    </div>
  )
}

export default function EscrowPage() {
  const [tab, setTab] = useState<'ledger' | 'disputes' | 'rules'>('ledger')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'ALL' | LedgerStatus>('ALL')
  const [selected, setSelected] = useState<LedgerRow | null>(null)
  const [selectedDispute, setSelectedDispute] = useState<DisputeRow | null>(null)

  const ledger: LedgerRow[] = useMemo(
    () => [
      { id: 'esc_10091', createdAt: '2026-01-31 00:12', job: 'Strata repaint – Tower A', client: 'Bayside Owners Corp', status: 'HOLD', amount: 18400, method: 'BANK', risk: 'LOW', ref: 'TRH-7K2A', slaHoursLeft: 61 },
      { id: 'esc_10090', createdAt: '2026-01-30 22:41', job: 'Emergency leak – Unit 34', client: 'S. Nguyen', status: 'RELEASED', amount: 890, method: 'CARD', risk: 'LOW', ref: 'TRH-1J9Q', slaHoursLeft: 0 },
      { id: 'esc_10089', createdAt: '2026-01-30 18:12', job: 'Ceiling patch + paint', client: 'M. Chen', status: 'DISPUTED', amount: 1350, method: 'PAYID', risk: 'MED', ref: 'TRH-0P4D', slaHoursLeft: 0 },
      { id: 'esc_10088', createdAt: '2026-01-30 12:27', job: 'Rope access – façade repair', client: 'Aria Facilities', status: 'HOLD', amount: 26750, method: 'BANK', risk: 'MED', ref: 'TRH-2R8M', slaHoursLeft: 19 },
      { id: 'esc_10087', createdAt: '2026-01-29 16:03', job: 'Bond clean', client: 'L. O’Brien', status: 'REFUNDED', amount: 620, method: 'CARD', risk: 'LOW', ref: 'TRH-9Z1C', slaHoursLeft: 0 },
      { id: 'esc_10086', createdAt: '2026-01-29 10:55', job: 'Kitchen reno stage 1', client: 'Harper Group', status: 'RELEASED', amount: 15200, method: 'BANK', risk: 'LOW', ref: 'TRH-4H6B', slaHoursLeft: 0 },
    ],
    []
  )

  const disputes: DisputeRow[] = useMemo(
    () => [
      { id: 'dsp_2201', openedAt: '2026-01-30 18:21', job: 'Ceiling patch + paint', client: 'M. Chen', priority: 'P1', reason: 'Finish quality / repaint request', state: 'INVESTIGATING', amount: 1350, escrowId: 'esc_10089' },
      { id: 'dsp_2200', openedAt: '2026-01-30 12:10', job: 'Rope access – façade repair', client: 'Aria Facilities', priority: 'P0', reason: 'Safety compliance documentation', state: 'AWAITING_TEAM', amount: 26750, escrowId: 'esc_10088' },
      { id: 'dsp_2199', openedAt: '2026-01-29 09:05', job: 'Bond clean', client: 'L. O’Brien', priority: 'P2', reason: 'Refund request', state: 'AWAITING_CLIENT', amount: 620, escrowId: 'esc_10087' },
    ],
    []
  )

  const filteredLedger = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return ledger.filter((r) => {
      const hit =
        !qq ||
        r.id.toLowerCase().includes(qq) ||
        r.job.toLowerCase().includes(qq) ||
        r.client.toLowerCase().includes(qq) ||
        r.ref.toLowerCase().includes(qq)
      const st = status === 'ALL' ? true : r.status === status
      return hit && st
    })
  }, [ledger, q, status])

  const totals = useMemo(() => {
    const hold = ledger.filter((x) => x.status === 'HOLD').reduce((a, b) => a + b.amount, 0)
    const released = ledger.filter((x) => x.status === 'RELEASED').reduce((a, b) => a + b.amount, 0)
    const disputed = ledger.filter((x) => x.status === 'DISPUTED').reduce((a, b) => a + b.amount, 0)
    const refunded = ledger.filter((x) => x.status === 'REFUNDED').reduce((a, b) => a + b.amount, 0)
    const holdsNearSla = ledger.filter((x) => x.status === 'HOLD' && x.slaHoursLeft > 0 && x.slaHoursLeft < 72).length
    return { hold, released, disputed, refunded, holdsNearSla }
  }, [ledger])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs ring-1 ring-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
              Escrow Control Center
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Institutional-grade escrow ops.</h1>
            <p className="mt-2 text-sm text-slate-300">
              Ledger, risk, release controls, dispute queue, and audit trails — designed for high-volume trade workflows.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search escrow ID, job, client, reference…"
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
                <option value="ALL">All statuses</option>
                <option value="HOLD">Hold</option>
                <option value="RELEASED">Released</option>
                <option value="DISPUTED">Disputed</option>
                <option value="REFUNDED">Refunded</option>
              </select>

              <button
                onClick={() => setSelected(ledger.find((x) => x.status === 'HOLD') || ledger[0])}
                className="rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm ring-1 ring-emerald-500/30 hover:bg-emerald-500/20"
              >
                Open drawer
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Kpi title="On hold" value={money(totals.hold)} subtitle="Funds protected" tone="amber" />
          <Kpi title="Released" value={money(totals.released)} subtitle="Settled to trade" tone="emerald" />
          <Kpi title="Disputed" value={money(totals.disputed)} subtitle="Needs intervention" tone="rose" />
          <Kpi title="Refunded" value={money(totals.refunded)} subtitle="Returned to payer" tone="slate" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Tab onClick={() => setTab('ledger')} active={tab === 'ledger'}>Ledger</Tab>
          <Tab onClick={() => setTab('disputes')} active={tab === 'disputes'}>Disputes</Tab>
          <Tab onClick={() => setTab('rules')} active={tab === 'rules'}>Rules & automation</Tab>
        </div>

        {tab === 'ledger' && (
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <Panel>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Escrow ledger</div>
                  <div className="text-xs text-slate-400">Click a row to open action drawer</div>
                </div>
                <div className="text-xs text-slate-400">{filteredLedger.length} items</div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-800">
                <div className="grid grid-cols-12 gap-2 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-3">Job</div>
                  <div className="col-span-2">Client</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-1 text-right">Risk</div>
                </div>

                <div className="divide-y divide-slate-800 bg-slate-950/40">
                  {filteredLedger.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="grid w-full grid-cols-12 gap-2 px-4 py-3 text-left text-sm hover:bg-slate-900/40"
                    >
                      <div className="col-span-2 font-medium">{r.id}</div>
                      <div className="col-span-3 truncate text-slate-200">{r.job}</div>
                      <div className="col-span-2 truncate text-slate-300">{r.client}</div>
                      <div className="col-span-2">
                        <span className={badge(statusTone(r.status))}>{r.status}</span>
                      </div>
                      <div className="col-span-2 text-right font-semibold">{money(r.amount)}</div>
                      <div className="col-span-1 text-right">
                        <span className={badge(riskTone(r.risk))}>{r.risk}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className={badge('slate')}>Audit-ready</span>
                <span className={badge('violet')}>Role-based actions</span>
                <span className={badge('emerald')}>Instant reconciliation</span>
                <span className={badge('amber')}>Automated holds</span>
              </div>
            </Panel>

            <Panel>
              <div className="text-sm font-semibold">Realtime signals</div>
              <div className="mt-1 text-xs text-slate-400">Operational intelligence for releases & disputes</div>

              <div className="mt-4 grid gap-3">
                <Signal title="Release velocity" value="↑ 12%" desc="Week-on-week settlement speed" tone="emerald" />
                <Signal
                  title="Hold breach risk"
                  value={`${totals.holdsNearSla} holds under 72h`}
                  desc="Approaching SLA breach window"
                  tone="amber"
                />
                <Signal title="Dispute cluster" value="1 active cluster" desc="Same job type / supplier pattern" tone="rose" />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
                <div className="text-xs text-slate-400">Suggested next action</div>
                <div className="mt-2 text-sm font-semibold">Pre-release inspection request</div>
                <div className="mt-1 text-xs text-slate-400">
                  Triggers an inspection checklist + photo evidence capture before release.
                </div>
                <button
                  onClick={() => setSelected(ledger.find((x) => x.status === 'HOLD') || ledger[0])}
                  className="mt-3 w-full rounded-xl bg-slate-950/50 px-3 py-2.5 text-sm ring-1 ring-slate-700 hover:bg-slate-950/70"
                >
                  Open in drawer
                </button>
              </div>
            </Panel>
          </div>
        )}

        {tab === 'disputes' && (
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <Panel>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Dispute queue</div>
                  <div className="text-xs text-slate-400">Prioritise, request evidence, resolve, release or refund</div>
                </div>
                <div className="text-xs text-slate-400">{disputes.length} active</div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-800">
                <div className="grid grid-cols-12 gap-2 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-3">Job</div>
                  <div className="col-span-2">Client</div>
                  <div className="col-span-2">State</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-1 text-right">Link</div>
                </div>

                <div className="divide-y divide-slate-800 bg-slate-950/40">
                  {disputes.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDispute(d)}
                      className="grid w-full grid-cols-12 gap-2 px-4 py-3 text-left text-sm hover:bg-slate-900/40"
                    >
                      <div className="col-span-2">
                        <span className={badge(prioTone(d.priority))}>{d.priority}</span>
                      </div>
                      <div className="col-span-3 truncate text-slate-200">{d.job}</div>
                      <div className="col-span-2 truncate text-slate-300">{d.client}</div>
                      <div className="col-span-2">
                        <span className={badge(stateTone(d.state))}>{d.state}</span>
                      </div>
                      <div className="col-span-2 text-right font-semibold">{money(d.amount)}</div>
                      <div className="col-span-1 text-right text-slate-400">{d.escrowId}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="text-sm font-semibold">Resolution playbook</div>
              <div className="mt-1 text-xs text-slate-400">Standardised dispute handling to prevent chaos</div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Evidence pack</div>
                    <span className={badge('violet')}>AUTO</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Photos, timestamps, inspection checklist, chat transcript, change orders.
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Decision window</div>
                    <span className={badge('amber')}>SLA</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Enforces escalation: ops lead → independent inspector → final resolution.
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Outcome enforcement</div>
                    <span className={badge('emerald')}>GUARDED</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Release, partial release, refund, or split — recorded with audit trail.
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        )}

        {tab === 'rules' && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel>
              <div className="text-sm font-semibold">Automation rules</div>
              <div className="mt-1 text-xs text-slate-400">Guardrails that stop bad releases before they happen</div>

              <div className="mt-4 grid gap-3">
                <Rule
                  title="Auto-hold on risk"
                  desc="If risk is MED or HIGH, force evidence pack before release."
                  tone="amber"
                />
                <Rule
                  title="SLA breach escalation"
                  desc="If hold is under 72 hours to breach, alert ops lead and open task."
                  tone="rose"
                />
                <Rule
                  title="Release confidence gate"
                  desc="Require: job marked complete + client sign-off OR inspection pass."
                  tone="emerald"
                />
                <Rule
                  title="Audit trail integrity"
                  desc="Every action requires reason + actor + timestamp + linked artefacts."
                  tone="violet"
                />
              </div>
            </Panel>

            <Panel>
              <div className="text-sm font-semibold">One-click actions</div>
              <div className="mt-1 text-xs text-slate-400">Designed for speed without sacrificing control</div>

              <div className="mt-4 grid gap-2">
                <Action label="Request inspection pack" />
                <Action label="Partial release (milestone)" />
                <Action label="Start dispute & freeze funds" />
                <Action label="Refund to payer" />
                <Action label="Export audit report" />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
                <div className="text-xs text-slate-400">Note</div>
                <div className="mt-2 text-sm text-slate-200">
                  This is UI scaffolding only. Next push wires these to Supabase actions with role-based access.
                </div>
              </div>
            </Panel>
          </div>
        )}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400">Escrow drawer</div>
            <div className="mt-1 text-xl font-semibold tracking-tight">{selected?.id}</div>
            <div className="mt-1 text-sm text-slate-300">{selected?.job}</div>
          </div>
          <button
            onClick={() => setSelected(null)}
            className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Mini label="Client" value={selected?.client || ''} />
          <Mini label="Created" value={selected?.createdAt || ''} />
          <Mini label="Reference" value={selected?.ref || ''} />
          <Mini label="Method" value={selected?.method || ''} />
          <Mini label="Amount" value={selected ? money(selected.amount) : ''} />
          <Mini label="Risk" value={selected?.risk || ''} tone={selected ? riskTone(selected.risk) : 'slate'} />
        </div>

        <div className="mt-5 rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Status</div>
            {selected ? <span className={badge(statusTone(selected.status))}>{selected.status}</span> : null}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Actions below are guarded by rules & audit. Next step wires them to Supabase.
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <DrawerAction label="Release funds" tone="emerald" />
          <DrawerAction label="Partial release (milestone)" tone="violet" />
          <DrawerAction label="Start dispute & freeze" tone="rose" />
          <DrawerAction label="Refund payer" tone="amber" />
          <DrawerAction label="Export audit trail" tone="slate" />
        </div>

        <div className="mt-6 rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
          <div className="text-sm font-semibold">Timeline</div>
          <div className="mt-3 grid gap-3">
            <TimelineRow title="Escrow created" meta={selected?.createdAt || ''} tone="emerald" />
            <TimelineRow title="Rules evaluated" meta="Risk + SLA + evidence gate" tone="violet" />
            <TimelineRow title="Awaiting action" meta="Ops decision required" tone="amber" />
          </div>
        </div>
      </Drawer>

      <Drawer open={!!selectedDispute} onClose={() => setSelectedDispute(null)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400">Dispute drawer</div>
            <div className="mt-1 text-xl font-semibold tracking-tight">{selectedDispute?.id}</div>
            <div className="mt-1 text-sm text-slate-300">{selectedDispute?.job}</div>
          </div>
          <button
            onClick={() => setSelectedDispute(null)}
            className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Mini label="Client" value={selectedDispute?.client || ''} />
          <Mini label="Opened" value={selectedDispute?.openedAt || ''} />
          <Mini label="Linked escrow" value={selectedDispute?.escrowId || ''} />
          <Mini label="Amount" value={selectedDispute ? money(selectedDispute.amount) : ''} />
          <Mini label="Priority" value={selectedDispute?.priority || ''} tone={selectedDispute ? prioTone(selectedDispute.priority) : 'slate'} />
          <Mini label="State" value={selectedDispute?.state || ''} tone={selectedDispute ? stateTone(selectedDispute.state) : 'slate'} />
        </div>

        <div className="mt-5 rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
          <div className="text-sm font-semibold">Reason</div>
          <div className="mt-2 text-sm text-slate-200">{selectedDispute?.reason}</div>
          <div className="mt-2 text-xs text-slate-400">Next push wires evidence pack + messaging + inspector workflow.</div>
        </div>

        <div className="mt-4 grid gap-2">
          <DrawerAction label="Request evidence pack" tone="violet" />
          <DrawerAction label="Assign inspector" tone="amber" />
          <DrawerAction label="Resolve & release" tone="emerald" />
          <DrawerAction label="Resolve & refund" tone="rose" />
        </div>

        <div className="mt-6 rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
          <div className="text-sm font-semibold">Audit</div>
          <div className="mt-3 grid gap-3">
            <TimelineRow title="Dispute opened" meta={selectedDispute?.openedAt || ''} tone="rose" />
            <TimelineRow title="Evidence requested" meta="Auto (rules)" tone="violet" />
            <TimelineRow title="Awaiting next step" meta="Ops action" tone="amber" />
          </div>
        </div>
      </Drawer>
    </div>
  )
}

function Mini(props: { label: string; value: string; tone?: any }) {
  return (
    <div className="rounded-2xl bg-slate-900/45 p-3 ring-1 ring-slate-800">
      <div className="text-xs text-slate-400">{props.label}</div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">{props.value}</div>
        {props.tone ? <span className={badge(props.tone)}>{String(props.value).toUpperCase()}</span> : null}
      </div>
    </div>
  )
}

function DrawerAction(props: { label: string; tone: any }) {
  return (
    <button className={cn('w-full rounded-2xl px-4 py-3 text-left text-sm ring-1 transition',
      props.tone === 'emerald' ? 'bg-emerald-500/12 ring-emerald-500/25 hover:bg-emerald-500/18' :
      props.tone === 'rose' ? 'bg-rose-500/12 ring-rose-500/25 hover:bg-rose-500/18' :
      props.tone === 'amber' ? 'bg-amber-500/12 ring-amber-500/25 hover:bg-amber-500/18' :
      props.tone === 'violet' ? 'bg-violet-500/12 ring-violet-500/25 hover:bg-violet-500/18' :
      'bg-slate-900/45 ring-slate-800 hover:bg-slate-900/70'
    )}>
      <div className="flex items-center justify-between">
        <div className="font-semibold">{props.label}</div>
        <span className={badge(props.tone)}>{String(props.tone).toUpperCase()}</span>
      </div>
      <div className="mt-1 text-xs text-slate-400">Requires reason + audit trail</div>
    </button>
  )
}

function TimelineRow(props: { title: string; meta: string; tone: any }) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn('mt-1 h-2.5 w-2.5 rounded-full',
        props.tone === 'emerald' ? 'bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.6)]' :
        props.tone === 'rose' ? 'bg-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.55)]' :
        props.tone === 'violet' ? 'bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.55)]' :
        'bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.55)]'
      )} />
      <div className="min-w-0">
        <div className="text-sm font-semibold">{props.title}</div>
        <div className="mt-0.5 text-xs text-slate-400">{props.meta}</div>
      </div>
    </div>
  )
}

function Rule(props: { title: string; desc: string; tone: any }) {
  return (
    <div className="rounded-2xl bg-slate-900/45 p-4 ring-1 ring-slate-800">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{props.title}</div>
        <span className={badge(props.tone)}>{String(props.tone).toUpperCase()}</span>
      </div>
      <div className="mt-1 text-xs text-slate-400">{props.desc}</div>
    </div>
  )
}

function Action(props: { label: string }) {
  return (
    <button className="w-full rounded-2xl bg-slate-900/45 px-4 py-3 text-left text-sm ring-1 ring-slate-800 hover:bg-slate-900/70">
      <div className="font-semibold">{props.label}</div>
      <div className="mt-1 text-xs text-slate-400">Queued as an ops task</div>
    </button>
  )
}
