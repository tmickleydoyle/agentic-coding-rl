'use client'
import { useRoutine } from '../components/RoutineProvider'
import type { Routine } from '../lib/types'

export function isComplete(routine: Routine): boolean {
  return routine.steps.length > 0 && routine.steps.every((s) => s.done)
}

export function completedToday(routine: Routine, today: string): boolean {
  return routine.history.includes(today)
}

function prevDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function routineStreak(routine: Routine, today: string): number {
  const set = new Set(routine.history)
  let cursor = set.has(today) ? today : prevDay(today)
  let streak = 0
  while (set.has(cursor)) {
    streak += 1
    cursor = prevDay(cursor)
  }
  return streak
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
