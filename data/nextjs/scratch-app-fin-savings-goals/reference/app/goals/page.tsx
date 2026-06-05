'use client'
import { useGoals } from '../../components/GoalsProvider'
import { useGoalsSummary } from '../../hooks/useGoals'
import StatCard from '../../components/StatCard'
import GoalCard from '../../components/GoalCard'

export default function GoalsPage() {
  const { goals, selectGoal } = useGoals()
  const { totals } = useGoalsSummary()
  return (
    <section data-testid="page-goals">
      <h1>Goals</h1>
      <div data-testid="stats">
        <StatCard label="Saved" value={totals.totalSaved} testid="saved" />
        <StatCard label="Target" value={totals.totalTarget} testid="target" />
        <StatCard label="Completed" value={totals.completedCount} testid="completed" />
        <StatCard label="Overall %" value={totals.overallPercent} testid="percent" />
      </div>
      {goals.length === 0 ? (
        <p data-testid="empty-goals">No goals yet.</p>
      ) : (
        <ul data-testid="goal-list">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} onSelect={selectGoal} />
          ))}
        </ul>
      )}
    </section>
  )
}
