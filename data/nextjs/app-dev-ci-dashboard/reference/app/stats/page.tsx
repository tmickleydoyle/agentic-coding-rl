'use client'
import { useApp } from '../../components/AppStateProvider'
import { useBuilds } from '../../hooks/useBuilds'
import StatCard from '../../components/StatCard'

export default function StatsPage() {
  const { pipelines } = useApp()
  const { counts, successRate } = useBuilds()
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={counts.total} testid="total" />
        <StatCard label="Passing" value={counts.passing} testid="passing" />
        <StatCard label="Failing" value={counts.failing} testid="failing" />
        <StatCard label="Running" value={counts.running} testid="running" />
        <StatCard label="Success rate" value={successRate} testid="success-rate" />
      </div>
      <ul data-testid="pipeline-builds">
        {pipelines.map((p) => (
          <li key={p.id} data-testid={`pipeline-builds-${p.id}`}>
            <span data-testid={`pipeline-builds-${p.id}-name`}>{p.name}</span>
            <span data-testid={`pipeline-builds-${p.id}-value`}>
              {counts.byPipeline[p.id] ?? 0}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
