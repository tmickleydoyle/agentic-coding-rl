'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Quadrant, Route, Task, Theme } from '../lib/types'

type NewTaskInput = { title: string; urgent: boolean; important: boolean }

type MatrixApi = {
  tasks: Task[]
  theme: Theme
  route: Route
  addTask: (input: NewTaskInput) => void
  moveTo: (id: string, quadrant: Quadrant) => void
  toggleUrgent: (id: string) => void
  toggleImportant: (id: string) => void
  removeTask: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const MatrixContext = createContext<MatrixApi | null>(null)

const STUB: MatrixApi = {
  tasks: [],
  theme: 'light',
  route: 'matrix',
  addTask: () => {},
  moveTo: () => {},
  toggleUrgent: () => {},
  toggleImportant: () => {},
  removeTask: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function MatrixProvider({ children }: { children: ReactNode }) {
  // TODO: hold tasks/theme/route in state (seed 4 tasks, one per quadrant), implement
  // addTask/moveTo (set flags from quadrant)/toggleUrgent/toggleImportant/removeTask, and
  // provide them through MatrixContext. The STUB below makes the app mount but does
  // nothing — replace it with real state + actions.
  return <MatrixContext.Provider value={STUB}>{children}</MatrixContext.Provider>
}

export function useMatrix(): MatrixApi {
  const v = useContext(MatrixContext)
  if (!v) throw new Error('useMatrix must be used within a MatrixProvider')
  return v
}
