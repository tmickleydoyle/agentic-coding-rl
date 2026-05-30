'use client'
import { isComplete, progressPercent } from '../hooks/useGoals'
import type { Goal } from '../lib/types'

export default function GoalCard({
  goal,
  onSelect,
}: {
  goal: Goal
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`goal-${goal.id}`} data-complete={isComplete(goal) ? 'true' : 'false'}>
      <span data-testid={`goal-${goal.id}-name`}>{goal.name}</span>
      <span data-testid={`goal-${goal.id}-saved`}>{goal.saved}</span>
      <span data-testid={`goal-${goal.id}-target`}>{goal.target}</span>
      <span data-testid={`goal-${goal.id}-percent`}>{progressPercent(goal)}</span>
      <button data-testid={`select-${goal.id}`} onClick={() => onSelect(goal.id)}>
        View
      </button>
    </li>
  )
}
