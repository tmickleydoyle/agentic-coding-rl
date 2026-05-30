'use client'
import { useRoutine } from '../components/RoutineProvider'
import type { LibraryExercise, Routine, Weekday } from '../lib/types'

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

// Routines grouped by the weekday they are assigned to (null-day ones excluded).
export function planByDay(routines: Routine[]): Record<Weekday, Routine[]> {
  const out: Record<Weekday, Routine[]> = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  }
  routines.forEach((r) => {
    if (r.day) out[r.day].push(r)
  })
  return out
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
