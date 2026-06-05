'use client'
import { useRoutineStats } from '../../hooks/useRoutineStats'
import StatCard from '../../components/StatCard'

export default function StatsPage() {
  const { total, completedToday, longestStreak } = useRoutineStats()
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <div data-testid="stats">
        <StatCard label="Total Routines" value={total} testid="total" />
        <StatCard label="Completed Today" value={completedToday} testid="completed" />
        <StatCard label="Longest Streak" value={longestStreak} testid="streak" />
      </div>
    </section>
  )
}
