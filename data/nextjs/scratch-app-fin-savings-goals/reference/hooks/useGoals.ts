'use client'
import { useGoals } from '../components/GoalsProvider'
import { TODAY, type Goal } from '../lib/types'

export function progressPercent(goal: Goal): number {
  if (goal.target <= 0) return 0
  const pct = (goal.saved / goal.target) * 100
  return Math.min(100, Math.round(pct))
}

export function remainingAmount(goal: Goal): number {
  return Math.max(0, goal.target - goal.saved)
}

export function isComplete(goal: Goal): boolean {
  return goal.saved >= goal.target
}

export function monthsToGoal(goal: Goal): number {
  if (isComplete(goal)) return 0
  if (goal.monthlyContribution <= 0) return Infinity
  return Math.ceil(remainingAmount(goal) / goal.monthlyContribution)
}

// Adds `months` to a YYYY-MM string, returning a YYYY-MM string.
export function addMonths(yearMonth: string, months: number): string {
  const [yStr, mStr] = yearMonth.split('-')
  const base = Number(yStr) * 12 + (Number(mStr) - 1) + months
  const year = Math.floor(base / 12)
  const month = (base % 12) + 1
  return `${year}-${String(month).padStart(2, '0')}`
}

export function projectedCompletion(goal: Goal, today: string = TODAY): string {
  if (isComplete(goal)) return 'Complete'
  const months = monthsToGoal(goal)
  if (!Number.isFinite(months)) return 'Never'
  return addMonths(today, months)
}

export type GoalsTotals = {
  totalTarget: number
  totalSaved: number
  completedCount: number
  overallPercent: number
}

export function totalsOf(goals: Goal[]): GoalsTotals {
  let totalTarget = 0
  let totalSaved = 0
  let completedCount = 0
  goals.forEach((g) => {
    totalTarget += g.target
    totalSaved += g.saved
    if (isComplete(g)) completedCount += 1
  })
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0
  return { totalTarget, totalSaved, completedCount, overallPercent }
}

export function useGoalsSummary() {
  const { goals } = useGoals()
  const totals = totalsOf(goals)
  return { totals }
}
