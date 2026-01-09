// app/tradehub/dashboard/page.tsx
import React from 'react'

type Kpi = { label: string; value: string }

// TODO: wire this to your real data source.
// Returning static values so the page compiles/deploys.
async function loadKpis(): Promise<Kpi[]> {
  return [
    { label: 'Release SLA', value: 'p95' },
    { label: 'Escrow volume', value: '$0' },
  ]
}

function getKpi(items: Kpi[], label: string): string {
  return (
    items.find(k => k.label.toLowerCase() === label.toLowerCase())?.value ?? '—'
  )
}

export default async function DashboardPage() {
  const items = await loadKpis()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Release SLA">
        <div className="kpi text-2xl font-semibold">
          {getKpi(items, 'Release SLA')}
        </div>
        <div className="sub text-sm text-gray-500">p95</div>
      </Card>

      <Card title="Escrow volume">
        <div className="kpi text-2xl font-semibold">
          {getKpi(items, 'Escrow volume')}
        </div>
        <div className="sub text-sm text-gray-500">Last 30 days</div>
      </Card>
    </div>
  )
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-white">
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      {children}
    </div>
  )
}
