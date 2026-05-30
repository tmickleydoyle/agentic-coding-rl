'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Routine, RoutineKind, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type RoutineApi = {
  routines: Routine[]
  theme: Theme
  route: Route
  today: string
  toggleStep: (routineId: string, stepId: string) => void
  addRoutine: (input: { name: string; kind: RoutineKind }) => void
  addStep: (routineId: string, label: string) => void
  removeRoutine: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const RoutineContext = createContext<RoutineApi | null>(null)

const STUB: RoutineApi = {
  routines: [],
  theme: 'light',
  route: 'today',
  today: TODAY,
  toggleStep: () => {},
  addRoutine: () => {},
  addStep: () => {},
  removeRoutine: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  // TODO: hold routines/theme/route/today in state (seed 2 routines), implement toggleStep
  // (flip step + recompute today's completion in history), addRoutine (id r3, …), addStep,
  // removeRoutine, navigate. The STUB makes the app mount but does nothing.
  return <RoutineContext.Provider value={STUB}>{children}</RoutineContext.Provider>
}

export function useRoutine(): RoutineApi {
  const v = useContext(RoutineContext)
  if (!v) throw new Error('useRoutine must be used within a RoutineProvider')
  return v
}
