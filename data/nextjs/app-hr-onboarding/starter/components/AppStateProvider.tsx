'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Hire, OnboardTask, Route, Theme } from '../lib/types'

type AppApi = {
  hires: Hire[]
  tasks: OnboardTask[]
  theme: Theme
  route: Route
  selectedHireId: string | null
  toggleTask: (taskId: string) => void
  setTaskDone: (taskId: string, done: boolean) => void
  addTask: (input: { hireId: string; label: string }) => void
  selectHire: (hireId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  hires: [],
  tasks: [],
  theme: 'light',
  route: 'hires',
  selectedHireId: null,
  toggleTask: () => {},
  setTaskDone: () => {},
  addTask: () => {},
  selectHire: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold hires/tasks/theme/route/selectedHireId in state (seed 3 hires + 6 tasks),
  // implement toggle/select/navigate, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
