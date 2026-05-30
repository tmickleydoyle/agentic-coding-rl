'use client'
import { useStep } from '../components/StepProvider'
import type { StepEntry } from '../lib/types'

export function sortedDesc(entries: StepEntry[]): StepEntry[] {
  // TODO: most-recent-first by date.
  return entries.slice()
}

export function computeStreak(_entries: StepEntry[], _goal: number): number {
  // TODO: consecutive most-recent days that met the goal.
  return 0
}

export function weeklyTotal(_entries: StepEntry[]): number {
  // TODO: sum of steps.
  return 0
}

export function weeklyAverage(_entries: StepEntry[]): number {
  // TODO: rounded average steps.
  return 0
}

export function useStepStats() {
  const { entries, goal } = useStep()
  const streak = computeStreak(entries, goal)
  const total = weeklyTotal(entries)
  const average = weeklyAverage(entries)
  const daysMetGoal = entries.filter((e) => e.steps >= goal).length
  return { streak, total, average, daysMetGoal, sorted: sortedDesc(entries) }
}
