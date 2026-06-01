'use client'
import type { Goal } from '../lib/types'
import { progressOf } from '../hooks/useGoalProgress'

export default function GoalCard({
  goal,
  onView,
}: {
  goal: Goal
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`goal-${goal.id}`}>
      <span data-testid={`goal-${goal.id}-name`}>{goal.name}</span>
      <span data-testid={`goal-${goal.id}-progress`}>{progressOf(goal)}</span>
      <button data-testid={`view-${goal.id}`} onClick={() => onView(goal.id)}>
        View
      </button>
    </li>
  )
}
