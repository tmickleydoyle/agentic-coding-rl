'use client'
import { useRoutine } from '../components/RoutineProvider'
import type { LibraryExercise, Routine, Weekday } from '../lib/types'

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export function planByDay(_routines: Routine[]): Record<Weekday, Routine[]> {
  // TODO: group routines by their assigned weekday (exclude null-day).
  return { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }
}

export function useWeek() {
  const { routines, library, today } = useRoutine()
  const byDay = planByDay(routines)
  const todaysRoutines = byDay[today]
  const exerciseById = (id: string): LibraryExercise | undefined =>
    library.find((e) => e.id === id)
  const assignedCount = routines.filter((r) => r.day !== null).length
  return { byDay, todaysRoutines, exerciseById, assignedCount }
}
