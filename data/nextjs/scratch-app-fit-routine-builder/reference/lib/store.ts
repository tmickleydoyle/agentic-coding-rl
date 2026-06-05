import type { LibraryExercise, Routine, Weekday } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let routines: Routine[] = []
let library: LibraryExercise[] = []
let nextRoutineId = 1

const DAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function seed(): void {
  library = [
    { id: 'x1', name: 'Push Up', muscle: 'Chest' },
    { id: 'x2', name: 'Pull Up', muscle: 'Back' },
    { id: 'x3', name: 'Air Squat', muscle: 'Legs' },
    { id: 'x4', name: 'Plank', muscle: 'Core' },
  ]
  routines = [
    { id: 'r1', name: 'Upper Body', exerciseIds: ['x1', 'x2'], day: 'mon' },
    { id: 'r2', name: 'Lower Body', exerciseIds: ['x3'], day: 'wed' },
    { id: 'r3', name: 'Core Blast', exerciseIds: ['x4'], day: null },
  ]
  nextRoutineId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listRoutines(): Routine[] {
  return routines.slice()
}

export function findRoutine(id: string): Routine | undefined {
  return routines.find((r) => r.id === id)
}

export function createRoutine(input: {
  name: string
  exerciseIds?: string[]
  day?: Weekday | null
}): Routine {
  const routine: Routine = {
    id: `r${nextRoutineId++}`,
    name: input.name,
    exerciseIds: input.exerciseIds ?? [],
    day: input.day ?? null,
  }
  routines.push(routine)
  return routine
}

function isWeekday(value: unknown): value is Weekday {
  return typeof value === 'string' && DAYS.indexOf(value as Weekday) !== -1
}

export function assignDay(id: string, day: Weekday | null): Routine | undefined {
  const routine = routines.find((r) => r.id === id)
  if (!routine) return undefined
  if (day === null || isWeekday(day)) routine.day = day
  return routine
}

export function deleteRoutine(id: string): boolean {
  const idx = routines.findIndex((r) => r.id === id)
  if (idx === -1) return false
  routines.splice(idx, 1)
  return true
}

export function listLibrary(): LibraryExercise[] {
  return library.slice()
}

export { DAYS }
