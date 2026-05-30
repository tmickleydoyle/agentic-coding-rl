'use client'
import { useGoalProgress } from '../../hooks/useGoalProgress'
import StatBadge from '../../components/StatBadge'

export default function CompletedPage() {
  const { completed } = useGoalProgress()
  return (
    <section data-testid="page-completed">
      <h1>Completed Goals</h1>
      <StatBadge label="Completed" value={completed.length} testid="completed-count" />
      {completed.length === 0 ? (
        <p data-testid="empty-state">No completed goals yet.</p>
      ) : (
        <ul data-testid="completed-list">
          {completed.map((g) => (
            <li key={g.id} data-testid={`completed-${g.id}`}>
              {g.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
