'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { LibraryExercise, Route, Routine, Theme, Weekday } from '../lib/types'

type NewRoutineInput = {
  name: string
  exerciseIds: string[]
}

type RoutineApi = {
  routines: Routine[]
  library: LibraryExercise[]
  theme: Theme
  route: Route
  today: Weekday
  addRoutine: (input: NewRoutineInput) => void
  removeRoutine: (id: string) => void
  assignDay: (id: string, day: Weekday | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const RoutineContext = createContext<RoutineApi | null>(null)

const SEED_LIBRARY: LibraryExercise[] = [
  { id: 'x1', name: 'Push Up', muscle: 'Chest' },
  { id: 'x2', name: 'Pull Up', muscle: 'Back' },
  { id: 'x3', name: 'Air Squat', muscle: 'Legs' },
  { id: 'x4', name: 'Plank', muscle: 'Core' },
]

const SEED_ROUTINES: Routine[] = [
  { id: 'r1', name: 'Upper Body', exerciseIds: ['x1', 'x2'], day: 'mon' },
  { id: 'r2', name: 'Lower Body', exerciseIds: ['x3'], day: 'wed' },
  { id: 'r3', name: 'Core Blast', exerciseIds: ['x4'], day: null },
]

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routines, setRoutines] = useState<Routine[]>(SEED_ROUTINES)
  const [library] = useState<LibraryExercise[]>(SEED_LIBRARY)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('routines')
  const [today] = useState<Weekday>('mon')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<RoutineApi>(() => {
    const addRoutine = (input: NewRoutineInput) => {
      const id = `r${nextId}`
      setNextId((n) => n + 1)
      setRoutines((prev) => [
        ...prev,
        { id, name: input.name, exerciseIds: input.exerciseIds, day: null },
      ])
    }

    const removeRoutine = (id: string) => {
      setRoutines((prev) => prev.filter((r) => r.id !== id))
    }

    const assignDay = (id: string, day: Weekday | null) => {
      setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, day } : r)))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      routines,
      library,
      theme,
      route,
      today,
      addRoutine,
      removeRoutine,
      assignDay,
      setTheme,
      navigate,
    }
  }, [routines, library, theme, route, today, nextId])

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>
}

export function useRoutine(): RoutineApi {
  const v = useContext(RoutineContext)
  if (!v) throw new Error('useRoutine must be used within a RoutineProvider')
  return v
}
