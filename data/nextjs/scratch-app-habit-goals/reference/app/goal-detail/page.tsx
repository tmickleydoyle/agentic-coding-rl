'use client'
import { useGoals } from '../../components/GoalProvider'
import { progressOf, daysLeft } from '../../hooks/useGoalProgress'

export default function GoalDetailPage() {
  const { goals, selectedId, today, toggleMilestone } = useGoals()
  const goal = goals.find((g) => g.id === selectedId)

  if (!goal) {
    return (
      <section data-testid="page-goal-detail">
        <p data-testid="no-selection">No goal selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-goal-detail">
      <h1 data-testid="detail-name">{goal.name}</h1>
      <p data-testid="detail-progress">{progressOf(goal)}</p>
      <p data-testid="detail-days-left">{daysLeft(goal, today)}</p>
      <ul data-testid="milestone-list">
        {goal.milestones.map((m) => (
          <li key={m.id} data-testid={`ms-${m.id}`} data-done={m.done ? 'true' : 'false'}>
            <span data-testid={`ms-${m.id}-title`}>{m.title}</span>
            <button
              data-testid={`toggle-ms-${m.id}`}
              onClick={() => toggleMilestone(goal.id, m.id)}
            >
              {m.done ? 'Undo' : 'Done'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
