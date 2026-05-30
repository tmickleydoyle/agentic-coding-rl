'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Task, Theme } from '../lib/types'

type PomodoroApi = {
  tasks: Task[]
  theme: Theme
  route: Route
  selectedId: string | null
  addTask: (title: string) => void
  removeTask: (id: string) => void
  toggleDone: (id: string) => void
  selectTask: (id: string | null) => void
  completeSession: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PomodoroContext = createContext<PomodoroApi | null>(null)

const STUB: PomodoroApi = {
  tasks: [],
  theme: 'light',
  route: 'tasks',
  selectedId: null,
  addTask: () => {},
  removeTask: () => {},
  toggleDone: () => {},
  selectTask: () => {},
  completeSession: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  // TODO: hold tasks/theme/route/selectedId in state (seed 3 tasks, selectedId 't1'),
  // implement the actions, and provide them through PomodoroContext. The STUB below makes
  // the app mount but does nothing — replace it with real state + actions.
  return <PomodoroContext.Provider value={STUB}>{children}</PomodoroContext.Provider>
}

export function usePomodoro(): PomodoroApi {
  const v = useContext(PomodoroContext)
  if (!v) throw new Error('usePomodoro must be used within a PomodoroProvider')
  return v
}
