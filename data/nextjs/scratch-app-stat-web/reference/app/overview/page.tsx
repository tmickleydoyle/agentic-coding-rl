'use client'
import { useApp } from '../../components/AppStateProvider'
import { useMetrics } from '../../hooks/useMetrics'
import StatCard from '../../components/StatCard'
import type { DateRange } from '../../lib/types'

export default function OverviewPage() {
  const { range, setRange } = useApp()
  const { totals, topPages, viewsFor } = useMetrics()
  const top = topPages(3)
  return (
    <section data-testid="page-overview">
      <h1>Overview</h1>
      <select
        data-testid="range-filter"
        value={range}
        onChange={(e) => setRange(e.target.value as DateRange)}
      >
        <option value="7d">7d</option>
        <option value="30d">30d</option>
        <option value="all">All time</option>
      </select>
      <div data-testid="stats">
        <StatCard label="Total views" value={totals.totalViews} testid="total-views" />
        <StatCard label="Total sessions" value={totals.totalSessions} testid="total-sessions" />
        <StatCard label="Avg bounce" value={totals.avgBounceRate} testid="avg-bounce" />
      </div>
      <ul data-testid="top-pages">
        {top.map((p) => (
          <li key={p.id} data-testid={`top-${p.id}`}>
            <span data-testid={`top-${p.id}-path`}>{p.path}</span>
            <span data-testid={`top-${p.id}-views`}>{viewsFor(p)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
