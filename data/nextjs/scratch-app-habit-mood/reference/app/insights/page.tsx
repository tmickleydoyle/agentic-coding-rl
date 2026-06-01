'use client'
import { useMoodInsights } from '../../hooks/useMoodInsights'
import StatCard from '../../components/StatCard'

export default function InsightsPage() {
  const { average, best, top, trend, count } = useMoodInsights()
  return (
    <section data-testid="page-insights">
      <h1>Insights</h1>
      <div data-testid="stats">
        <StatCard label="Average" value={average} testid="average" />
        <StatCard label="Best Score" value={best ? best.score : '-'} testid="best" />
        <StatCard label="Top Trigger" value={top ?? '-'} testid="top" />
        <StatCard label="Trend" value={trend} testid="trend" />
        <StatCard label="Entries" value={count} testid="count" />
      </div>
    </section>
  )
}
