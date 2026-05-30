'use client'
import { useReadingStats } from '../../hooks/useReadingStats'
import StatCard from '../../components/StatCard'

export default function StatsPage() {
  const { total, streak, average, finished } = useReadingStats()
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <div data-testid="stats">
        <StatCard label="Total Pages" value={total} testid="total" />
        <StatCard label="Streak" value={streak} testid="streak" />
        <StatCard label="Avg Pages/Day" value={average} testid="average" />
        <StatCard label="Books Finished" value={finished} testid="finished" />
      </div>
    </section>
  )
}
