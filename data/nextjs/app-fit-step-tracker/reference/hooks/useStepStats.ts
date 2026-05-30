'use client'
import { useStep } from '../components/StepProvider'
import type { StepEntry } from '../lib/types'

// Most-recent-first sort by date string (ISO dates sort lexically).
export function sortedDesc(entries: StepEntry[]): StepEntry[] {
  return entries.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

// Streak: number of consecutive most-recent days (by date order) that met the goal.
export function computeStreak(entries: StepEntry[], goal: number): number {
  const ordered = sortedDesc(entries)
  let streak = 0
  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i].steps >= goal) streak += 1
    else break
  }
  return streak
}

export function weeklyTotal(entries: StepEntry[]): number {
  let total = 0
  entries.forEach((e) => {
    total += e.steps
  })
  return total
}

export function weeklyAverage(entries: StepEntry[]): number {
  if (entries.length === 0) return 0
  return Math.round(weeklyTotal(entries) / entries.length)
}

export function useStepStats() {
  const { entries, goal } = useStep()
  const streak = computeStreak(entries, goal)
  const total = weeklyTotal(entries)
  const average = weeklyAverage(entries)
  const daysMetGoal = entries.filter((e) => e.steps >= goal).length
  return { streak, total, average, daysMetGoal, sorted: sortedDesc(entries) }
}
