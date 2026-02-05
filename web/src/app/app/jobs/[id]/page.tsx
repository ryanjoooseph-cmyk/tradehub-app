'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Upload, Edit, Send, FileText, Calendar, CheckCircle } from 'lucide-react'

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')
const money = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function Pill(props: { tone: 'blue' | 'yellow' | 'orange' | 'green' | 'red' | 'slate' | 'violet'; children: React.ReactNode }) {
  const map: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400 ring-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400 ring-yellow-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:bg-orange-950 dark:text-orange-400 ring-orange-500/20',
    green: 'bg-green-500/10 text-green-600 dark:bg-green-950 dark:text-green-400 ring-green-500/20',
    red: 'bg-red-500/10 text-red-600 dark:bg-red-950 dark:text-red-400 ring-red-500/20',
    violet: 'bg-violet-500/10 text-violet-600 dark:bg-violet-950 dark:text-violet-400 ring-violet-500/20',
    slate: 'bg-slate-500/10 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-500/20',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${map[props.tone]}`}>{props.children}</span>
}

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border bg-card p-5', props.className)}>
      {props.children}
    </div>
  )
}

function SectionTitle(props: { title: string; sub?: string }) {
  return (
    <div>
      <div className="text-lg font-semibold">{props.title}</div>
      {props.sub ? <div className="mt-1 text-sm text-muted-foreground">{props.sub}</div> : null}
    </div>
  )
}

type MilestoneState = 'DRAFT' | 'FUNDED' | 'WORK_SUBMITTED' | 'EVIDENCE_REVIEW' | 'RELEASED' | 'DISPUTED'

// Seeded data from PR4 checklist
const jobDetail = {
  id: 'J-1402',
  number: 'J-1402',
  status: 'in_progress',
  client: { name: 'Acme Body Corp', contact: 'L. Chen' },
  site: { address: 'Southbank - Tower A', level: '12-32' },
  team: [{ name: 'Ryan J', role: 'Lead' }, { name: 'Crew A', role: 'Team' }],
  scopeOfWork: 'High-rise façade repair and painting. Includes rope access, safety compliance, and staged milestone releases with photo evidence.',
  totalValue: 18900,
  scheduledStart: '2026-02-06',
  milestones: [
    { title: 'Initial deposit', amount: 6450, state: 'RELEASED' as MilestoneState, dueDate: '2026-01-29' },
    { title: 'Progress claim #1', amount: 9450, state: 'FUNDED' as MilestoneState, dueDate: '2026-02-10' },
    { title: 'Final completion', amount: 3000, state: 'DRAFT' as MilestoneState, dueDate: '2026-02-20' }
  ],
  timeline: [
    { event: 'Job created', timestamp: '2026-01-28', actor: 'Ryan J' },
    { event: 'Milestone #1 funded', timestamp: '2026-01-29', actor: 'Client' },
    { event: 'Work started', timestamp: '2026-02-01', actor: 'Ryan J' }
  ],
  files: [] as string[]
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const jobId = decodeURIComponent(params?.id ?? 'unknown')
  
  const tabParam = searchParams?.get('tab') || 'overview'
  const validTabs = ['overview', 'milestones', 'timeline', 'files'] as const
  const [tab, setTab] = useState<'overview' | 'milestones' | 'timeline' | 'files'>(
    validTabs.includes(tabParam as typeof validTabs[number]) ? (tabParam as typeof validTabs[number]) : 'overview'
  )

  const handleTabChange = (newTab: 'overview' | 'milestones' | 'timeline' | 'files') => {
    setTab(newTab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newTab)
    router.push(url.pathname + url.search, { scroll: false })
  }

  const job = useMemo(() => {
    if (jobId === jobDetail.id) {
      return jobDetail
    }
    // Fallback for other job IDs
    return {
      ...jobDetail,
      id: jobId,
      number: jobId,
    }
  }, [jobId])

  const getMilestoneColor = (state: MilestoneState): 'blue' | 'yellow' | 'orange' | 'green' | 'red' | 'slate' => {
    const map: Record<MilestoneState, 'blue' | 'yellow' | 'orange' | 'green' | 'red' | 'slate'> = {
      FUNDED: 'blue',
      WORK_SUBMITTED: 'yellow',
      EVIDENCE_REVIEW: 'orange',
      RELEASED: 'green',
      DISPUTED: 'red',
      DRAFT: 'slate',
    }
    return map[state]
  }

  const totalEscrow = job.milestones.reduce((sum, m) => sum + m.amount, 0)
  const releasedAmount = job.milestones.filter(m => m.state === 'RELEASED').reduce((sum, m) => sum + m.amount, 0)
  const pendingReleases = job.milestones.filter(m => m.state === 'FUNDED' || m.state === 'WORK_SUBMITTED' || m.state === 'EVIDENCE_REVIEW').length
  const disputes = job.milestones.filter(m => m.state === 'DISPUTED').length

  return (
    <div className="relative min-h-screen">
      {/* Escrow Status Badge - Sticky */}
      <div className="sticky top-16 z-30 mb-4 flex justify-end">
        <button
          onClick={() => handleTabChange('milestones')}
          className="rounded-2xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur transition-transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Escrow Total</div>
              <div className="text-lg font-semibold">{money(totalEscrow)}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-sm font-semibold">{pendingReleases} releases</div>
            </div>
            {disputes > 0 && (
              <>
                <div className="h-8 w-px bg-border" />
                <div className="text-left">
                  <div className="text-xs text-red-600 dark:text-red-400">Disputes</div>
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">{disputes}</div>
                </div>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/app/jobs" className="rounded-lg border bg-background px-3 py-1.5 text-xs hover:bg-muted">
              ← Jobs
            </Link>
            <Pill tone={job.status === 'in_progress' ? 'blue' : 'slate'}>{job.status.toUpperCase()}</Pill>
            <Pill tone="slate">{job.number}</Pill>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Job Detail</h1>
          <div className="mt-2 text-sm text-muted-foreground">
            {job.client.name} • {job.site.address}
          </div>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted">
            <Edit className="h-4 w-4" />
            Edit job
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted">
            <Send className="h-4 w-4" />
            Send update
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted">
            <FileText className="h-4 w-4" />
            Add note
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted">
            <Calendar className="h-4 w-4" />
            Schedule
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border bg-green-500/10 px-4 py-2 text-sm text-green-600 hover:bg-green-500/20 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            Complete
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-2 border-b pb-4">
          <button
            onClick={() => handleTabChange('overview')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange('milestones')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === 'milestones' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Milestones
          </button>
          <button
            onClick={() => handleTabChange('timeline')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === 'timeline' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Timeline
          </button>
          <button
            onClick={() => handleTabChange('files')}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === 'files' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Files
          </button>
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <div className="text-sm text-muted-foreground">Client</div>
                <div className="mt-2 text-lg font-semibold">{job.client.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">Contact: {job.client.contact}</div>
              </Card>
              <Card>
                <div className="text-sm text-muted-foreground">Site</div>
                <div className="mt-2 text-lg font-semibold">{job.site.address}</div>
                <div className="mt-1 text-sm text-muted-foreground">Level: {job.site.level}</div>
              </Card>
              <Card>
                <div className="text-sm text-muted-foreground">Team</div>
                <div className="mt-2 space-y-1">
                  {job.team.map((member, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold">{member.name}</span> - {member.role}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle title="Scope of Work" />
              <div className="mt-3 text-sm text-muted-foreground">{job.scopeOfWork}</div>
            </Card>

            <Card>
              <SectionTitle title="Timeline Summary" />
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Scheduled Start</div>
                  <div className="mt-1 font-semibold">{job.scheduledStart}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="mt-1 font-semibold capitalize">{job.status.replace('_', ' ')}</div>
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle title="Budget Breakdown" />
              <div className="mt-3 space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Total Job Value</span>
                  <span className="font-semibold">{money(job.totalValue)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Escrowed Amount</span>
                  <span className="font-semibold">{money(totalEscrow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Released to Date</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{money(releasedAmount)}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Milestones Tab */}
        {tab === 'milestones' && (
          <div className="mt-6">
            <SectionTitle title="Milestones" sub="Escrow-linked payment milestones" />
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {job.milestones.map((milestone, i) => (
                <Card key={i} className="transition-transform hover:scale-[1.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{milestone.title}</div>
                      <div className="mt-1 text-2xl font-bold">{money(milestone.amount)}</div>
                    </div>
                    <Pill tone={getMilestoneColor(milestone.state)}>{milestone.state}</Pill>
                  </div>
                  {milestone.dueDate && (
                    <div className="mt-3 text-xs text-muted-foreground">Due: {milestone.dueDate}</div>
                  )}
                  {milestone.state === 'FUNDED' && (
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-0 bg-blue-500" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {tab === 'timeline' && (
          <div className="mt-6">
            <SectionTitle title="Timeline" sub="Audit events and job history" />
            <div className="mt-4 space-y-4">
              {job.timeline.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {i + 1}
                    </div>
                    {i < job.timeline.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{event.event}</div>
                          <div className="mt-1 text-sm text-muted-foreground">by {event.actor}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{event.timestamp}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files Tab */}
        {tab === 'files' && (
          <div className="mt-6">
            <SectionTitle title="Files" sub="Photos, PDFs, and documents" />
            
            {/* Upload Zone */}
            <div className="mt-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-3 text-sm font-medium">Drop files here or click to upload</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Supports: JPG, PNG, PDF, DOC (max 10MB)
              </div>
              <button className="mt-4 rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted">
                Browse Files
              </button>
            </div>

            {/* Files Grid */}
            {job.files.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {job.files.map((file, i) => (
                  <Card key={i}>
                    <div className="aspect-video rounded-lg bg-muted" />
                    <div className="mt-3">
                      <div className="text-sm font-semibold">{file}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <button className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                          Download
                        </button>
                        <span className="text-xs text-muted-foreground">•</span>
                        <button className="text-xs text-red-600 hover:underline dark:text-red-400">
                          Delete
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border bg-muted/20 py-12 text-center">
                <div className="text-4xl opacity-20">📁</div>
                <div className="mt-3 font-semibold">No files yet</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Upload photos and documents to attach to this job
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
