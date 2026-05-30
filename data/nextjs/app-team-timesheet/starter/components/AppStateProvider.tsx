'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Day, Entry, Project, Route, Theme } from '../lib/types'

type LogHoursInput = {
  projectId: string
  day: Day
  hours: number
}

type AppApi = {
  projects: Project[]
  entries: Entry[]
  theme: Theme
  route: Route
  logHours: (input: LogHoursInput) => void
  submitEntry: (id: string) => void
  submitAll: () => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  projects: [],
  entries: [],
  theme: 'light',
  route: 'week',
  logHours: () => {},
  submitEntry: () => {},
  submitAll: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold projects/entries/theme/route in state (seed 3 projects + 3 entries),
  // implement logHours/submitEntry/submitAll/navigate, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
