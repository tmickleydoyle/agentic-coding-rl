'use client'
import type { Goal } from '../lib/types'

export default function GoalCard({
  goal,
  onView,
}: {
  goal: Goal
  onView: (id: string) => void
}) {
  // TODO: render name, progress, and a view-<id> button (calls onView).
  void onView
  return <li data-testid={`goal-${goal.id}`} />
}
