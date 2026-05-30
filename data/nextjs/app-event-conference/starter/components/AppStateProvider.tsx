'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Session, Theme } from '../lib/types'

type AppApi = {
  sessions: Session[]
  agenda: string[]
  theme: Theme
  route: Route
  selectedSessionId: string | null
  selectSession: (id: string) => void
  inAgenda: (id: string) => boolean
  conflictsWith: (id: string) => string | null
  addToAgenda: (id: string) => boolean
  removeFromAgenda: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  sessions: [],
  agenda: [],
  theme: 'light',
  route: 'schedule',
  selectedSessionId: null,
  selectSession: () => {},
  inAgenda: () => false,
  conflictsWith: () => null,
  addToAgenda: () => false,
  removeFromAgenda: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold sessions/agenda/theme/route/selectedSessionId in state (seed 4 sessions,
  // agenda starts ['s1']); implement selectSession/inAgenda/conflictsWith/addToAgenda/
  // removeFromAgenda/navigate, and provide them through AppContext. The STUB makes the app
  // mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
