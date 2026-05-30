'use client'
import { useRoutine } from '../components/RoutineProvider'
import type { Routine } from '../lib/types'

export function isComplete(routine: Routine): boolean {
  return routine.steps.length > 0 && routine.steps.every((s) => s.done)
}

export function completedToday(routine: Routine, today: string): boolean {
  return routine.history.includes(today)
}

export function routineStreak(_routine: Routine, _today: string): number {
  // TODO: consecutive completed days ending at today (or the day before if not done today).
  return 0
}

export function useRoutineStats() {
  const { routines, today } = useRoutine()
  const total = routines.length
  const completed = routines.filter((r) => completedToday(r, today)).length
  let longestStreak = 0
  routines.forEach((r) => {
    const s = routineStreak(r, today)
    if (s > longestStreak) longestStreak = s
  })
  return { total, completedToday: completed, longestStreak }
}
