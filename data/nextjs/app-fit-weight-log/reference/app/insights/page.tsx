'use client'
import { useInsights } from '../../hooks/useInsights'
import StatCard from '../../components/StatCard'

export default function InsightsPage() {
  const { latest, latestTrend, changeFromStart, progress } = useInsights()
  return (
    <section data-testid="page-insights">
      <h1>Insights</h1>
      <div data-testid="stats">
        <StatCard label="Latest" value={latest ? latest.weight : 0} testid="latest" />
        <StatCard label="Trend" value={latestTrend} testid="trend" />
        <StatCard label="Change" value={changeFromStart} testid="change" />
        <StatCard label="Progress" value={progress} testid="progress" />
      </div>
    </section>
  )
}
