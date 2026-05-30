'use client'
import { useGoals } from '../components/GoalProvider'
import type { Goal } from '../lib/types'

export function progressOf(goal: Goal): number {
  if (goal.milestones.length === 0) return 0
  const done = goal.milestones.filter((m) => m.done).length
  return Math.round((done / goal.milestones.length) * 100)
}

export function isComplete(goal: Goal): boolean {
  return goal.milestones.length > 0 && goal.milestones.every((m) => m.done)
}

export function daysLeft(goal: Goal, today: string): number {
  const a = new Date(`${today}T00:00:00Z`).getTime()
  const b = new Date(`${goal.targetDate}T00:00:00Z`).getTime()
  return Math.round((b - a) / 86400000)
}

export function useGoalProgress() {
  const { goals } = useGoals()
  const active = goals.filter((g) => !isComplete(g))
  const completed = goals.filter((g) => isComplete(g))
  let sum = 0
  goals.forEach((g) => {
    sum += progressOf(g)
  })
  const overallProgress = goals.length === 0 ? 0 : Math.round(sum / goals.length)
  return { active, completed, overallProgress }
}
