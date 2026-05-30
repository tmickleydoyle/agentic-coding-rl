'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Initiative, Quarter, Route, Status, Theme } from '../lib/types'

type NewInitiativeInput = {
  title: string
  quarterId: string
}

type AppApi = {
  quarters: Quarter[]
  initiatives: Initiative[]
  theme: Theme
  route: Route
  selectedId: string | null
  addInitiative: (input: NewInitiativeInput) => void
  moveInitiative: (id: string, quarterId: string) => void
  setStatus: (id: string, status: Status) => void
  selectInitiative: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  quarters: [],
  initiatives: [],
  theme: 'light',
  route: 'roadmap',
  selectedId: null,
  addInitiative: () => {},
  moveInitiative: () => {},
  setStatus: () => {},
  selectInitiative: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold quarters/initiatives/theme/route/selectedId in state (seed 4 quarters + 3
  // initiatives), implement the actions, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
