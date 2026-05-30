'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Objective, Route, Theme } from '../lib/types'

type NewObjectiveInput = {
  title: string
  owner: string
}

type AppApi = {
  objectives: Objective[]
  theme: Theme
  route: Route
  selectedId: string | null
  addObjective: (input: NewObjectiveInput) => void
  updateProgress: (objectiveId: string, krId: string, progress: number) => void
  selectObjective: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  objectives: [],
  theme: 'light',
  route: 'objectives',
  selectedId: null,
  addObjective: () => {},
  updateProgress: () => {},
  selectObjective: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold objectives/theme/route/selectedId in state (seed 2 objectives), implement
  // the actions, and provide them through AppContext. The STUB below makes the app mount
  // but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
