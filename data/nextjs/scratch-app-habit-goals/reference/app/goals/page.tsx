'use client'
import { useGoals } from '../../components/GoalProvider'
import { useGoalProgress } from '../../hooks/useGoalProgress'
import GoalCard from '../../components/GoalCard'

export default function GoalsPage() {
  const { selectGoal } = useGoals()
  const { active } = useGoalProgress()
  return (
    <section data-testid="page-goals">
      <h1>Active Goals</h1>
      {active.length === 0 ? (
        <p data-testid="empty-state">No active goals.</p>
      ) : (
        <ul data-testid="goal-list">
          {active.map((g) => (
            <GoalCard key={g.id} goal={g} onView={selectGoal} />
          ))}
        </ul>
      )}
    </section>
  )
}
