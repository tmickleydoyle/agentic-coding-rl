'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: RoutineApi = {
  routines: [],
  library: [],
  theme: 'light',
  route: 'routines',
  today: 'mon',
  addRoutine: () => {},
  removeRoutine: () => {},
  assignDay: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  // TODO: hold routines/library/theme/route/today in state (seed 4 library exercises + 3
  // routines), implement addRoutine/removeRoutine/assignDay/navigate, and provide them
  // through RoutineContext. The STUB below makes the app mount but does nothing.
  return <RoutineContext.Provider value={STUB}>{children}</RoutineContext.Provider>
}

export function useRoutine(): RoutineApi {
  const v = useContext(RoutineContext)
  if (!v) throw new Error('useRoutine must be used within a RoutineProvider')
  return v
}
