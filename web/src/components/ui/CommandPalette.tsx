'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Item = {
  label: string
  hint?: string
  href: string
  group: 'Navigate' | 'Create'
  keywords?: string[]
}

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)

  const items = useMemo<Item[]>(
    () => [
      { group: 'Navigate', label: 'Dashboard', href: '/app/dashboard', hint: 'Overview', keywords: ['home', 'overview', 'metrics'] },
      { group: 'Navigate', label: 'Jobs', href: '/app/jobs', hint: 'Operations board', keywords: ['work', 'tasks', 'ops'] },
      { group: 'Navigate', label: 'Calendar', href: '/app/calendar', hint: 'Job-first schedule', keywords: ['schedule', 'dates', 'timeline'] },
      { group: 'Navigate', label: 'Clients', href: '/app/clients', hint: 'CRM', keywords: ['customer', 'accounts'] },
      { group: 'Navigate', label: 'Invoices', href: '/app/invoices', hint: 'Billing', keywords: ['billing', 'payments'] },
      { group: 'Navigate', label: 'Escrow', href: '/app/escrow', hint: 'Funds & disputes', keywords: ['trust', 'milestones', 'disputes'] },
      { group: 'Navigate', label: 'Team', href: '/app/team', hint: 'People & roles', keywords: ['staff', 'roles', 'permissions'] },
      { group: 'Navigate', label: 'Settings', href: '/app/settings', hint: 'Platform config', keywords: ['config', 'preferences'] },

      { group: 'Create', label: 'New job', href: '/app/jobs', hint: 'Start a job', keywords: ['create', 'job', 'new'] },
      { group: 'Create', label: 'New client', href: '/app/clients', hint: 'Add client', keywords: ['create', 'client', 'new'] },
      { group: 'Create', label: 'New invoice', href: '/app/invoices', hint: 'Issue invoice', keywords: ['create', 'invoice', 'new'] },
      { group: 'Create', label: 'Open escrow center', href: '/app/escrow', hint: 'Escrow control', keywords: ['escrow', 'release', 'hold'] },
    ],
    []
  )

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((it) => {
      const k = (it.keywords || []).join(' ')
      return `${it.label} ${it.hint || ''} ${it.href} ${k}`.toLowerCase().includes(s)
    })
  }, [q, items])

  const groups = useMemo(() => {
    const nav = filtered.filter((i) => i.group === 'Navigate')
    const create = filtered.filter((i) => i.group === 'Create')
    return { nav, create }
  }, [filtered])

  const flat = useMemo(() => [...groups.nav, ...groups.create], [groups])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (!open) return
      if (k === 'escape') setOpen(false)
      if (k === 'arrowdown') {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, Math.max(0, flat.length - 1)))
      }
      if (k === 'arrowup') {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
      }
      if (k === 'enter') {
        e.preventDefault()
        const it = flat[active]
        if (!it) return
        setOpen(false)
        setQ('')
        setTimeout(() => setActive(0), 0)
        router.push(it.href)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, active, flat, router])

  useEffect(() => {
    if (!open) return
    setTimeout(() => setActive(0), 0)
    const t = setTimeout(() => {
      const el = document.getElementById('cmdk-input') as HTMLInputElement | null
      el?.focus()
    }, 30)
    return () => clearTimeout(t)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50"
      onMouseDown={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="absolute left-1/2 top-20 w-[92vw] max-w-2xl -translate-x-1/2">
        <div
          className="rounded-3xl bg-slate-950/70 ring-1 ring-slate-800 shadow-2xl overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-4 bg-slate-900/55">
            <div className="rounded-2xl bg-slate-950/60 ring-1 ring-slate-800 px-3 py-2 text-xs text-slate-300">
              ⌘K
            </div>
            <input
              id="cmdk-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search anything…"
              className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 outline-none"
            />
            <button
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-slate-950/60 ring-1 ring-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-950/80"
            >
              Esc
            </button>
          </div>

          <div className="max-h-[520px] overflow-auto p-2">
            {flat.length === 0 ? (
              <div className="p-6 text-sm text-slate-400">No results.</div>
            ) : (
              <div className="space-y-2">
                {groups.nav.length > 0 && (
                  <Section
                    title="Navigate"
                    items={groups.nav}
                    activeIndex={active}
                    offset={0}
                    onHover={(i) => setActive(i)}
                    onSelect={(href) => {
                      setOpen(false)
                      setQ('')
                      setTimeout(() => setActive(0), 0)
                      router.push(href)
                    }}
                  />
                )}
                {groups.create.length > 0 && (
                  <Section
                    title="Create"
                    items={groups.create}
                    activeIndex={active}
                    offset={groups.nav.length}
                    onHover={(i) => setActive(i)}
                    onSelect={(href) => {
                      setOpen(false)
                      setQ('')
                      setTimeout(() => setActive(0), 0)
                      router.push(href)
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-400 bg-slate-900/35">
            <div>↑↓ to navigate • Enter to open</div>
            <div className="hidden sm:block">Tip: type “escrow”, “jobs”, “invoice”…</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section(props: {
  title: string
  items: Item[]
  activeIndex: number
  offset: number
  onHover: (i: number) => void
  onSelect: (href: string) => void
}) {
  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-slate-800 bg-slate-950/40">
      <div className="px-4 py-2 text-xs font-semibold tracking-wide text-slate-300 bg-slate-900/45">
        {props.title}
      </div>
      <div className="divide-y divide-slate-800">
        {props.items.map((it, idx) => {
          const absoluteIndex = props.offset + idx
          const isActive = absoluteIndex === props.activeIndex
          return (
            <button
              key={`${it.group}-${it.label}-${it.href}`}
              onMouseEnter={() => props.onHover(absoluteIndex)}
              onClick={() => props.onSelect(it.href)}
              className={cn(
                'w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition',
                isActive ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'hover:bg-slate-900/35'
              )}
            >
              <div>
                <div className="text-sm font-semibold text-slate-100">{it.label}</div>
                <div className="mt-1 text-xs text-slate-400">{it.hint || it.href}</div>
              </div>
              <div className="text-[10px] text-slate-500">{it.href}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
