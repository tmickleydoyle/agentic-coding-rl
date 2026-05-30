'use client'
import { useGoals } from '../components/GoalProvider'
import type { Goal } from '../lib/types'

export function progressOf(_goal: Goal): number {
  // TODO: percent of milestones done, rounded.
  return 0
}

export function isComplete(_goal: Goal): boolean {
  // TODO: has milestones and all are done.
  return false
}

export function daysLeft(_goal: Goal, _today: string): number {
  // TODO: whole days from today to targetDate.
  return 0
}

export function useGoalProgress() {
  const { goals } = useGoals()
  const active = goals.filter((g) => !isComplete(g))
  const completed = goals.filter((g) => isComplete(g))
  return { active, completed, overallProgress: 0 }
}
