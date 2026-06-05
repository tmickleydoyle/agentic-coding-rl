'use client'
import { useHabitStats } from '../../hooks/useHabitStats'
import StatCard from '../../components/StatCard'

export default function StatsPage() {
  const { doneToday, totalHabits, completionRate, longestStreak } = useHabitStats()
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <div data-testid="stats">
        <StatCard label="Done Today" value={doneToday} testid="done" />
        <StatCard label="Total Habits" value={totalHabits} testid="total" />
        <StatCard label="Completion %" value={completionRate} testid="rate" />
        <StatCard label="Longest Streak" value={longestStreak} testid="streak" />
      </div>
    </section>
  )
}
