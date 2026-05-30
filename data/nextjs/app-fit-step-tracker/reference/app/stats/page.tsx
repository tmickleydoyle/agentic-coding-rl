'use client'
import { useStepStats } from '../../hooks/useStepStats'
import StatCard from '../../components/StatCard'

export default function StatsPage() {
  const { streak, total, average, daysMetGoal } = useStepStats()
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <div data-testid="stats">
        <StatCard label="Streak" value={streak} testid="streak" />
        <StatCard label="Weekly Total" value={total} testid="total" />
        <StatCard label="Daily Average" value={average} testid="average" />
        <StatCard label="Days Met Goal" value={daysMetGoal} testid="met" />
      </div>
    </section>
  )
}
