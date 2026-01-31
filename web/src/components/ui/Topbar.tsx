'use client'

import Link from 'next/link'
import { useState } from 'react'

const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(' ')

export default function Topbar() {
  const [q, setQ] = useState('')

  return (
    <div className="sticky top-0 z-40">
      <div className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/25 flex items-center justify-center font-semibold">
                TH
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">TradeHub</div>
                <div className="text-xs text-slate-400 leading-tight">Operations OS</div>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌘K</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search (opens Command Palette)…"
                className={cn(
                  'w-[62vw] max-w-[520px] md:w-[520px]',
                  'rounded-2xl bg-slate-950/60 ring-1 ring-slate-800 px-11 py-2.5 text-sm',
                  'placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/35'
                )}
                onFocus={() => {
                  const ev = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
                  window.dispatchEvent(ev)
                  setQ('')
                }}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/app/jobs" className="hidden sm:inline-flex rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
              Jobs
            </Link>
            <Link href="/app/escrow" className="inline-flex rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm ring-1 ring-emerald-500/25 hover:bg-emerald-500/20">
              Escrow
            </Link>
            <button className="rounded-xl bg-slate-900/55 px-4 py-2.5 text-sm ring-1 ring-slate-800 hover:bg-slate-900/80">
              New
            </button>
            <div className="h-9 w-9 rounded-2xl bg-slate-900/55 ring-1 ring-slate-800 flex items-center justify-center text-sm font-semibold">
              RJ
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
