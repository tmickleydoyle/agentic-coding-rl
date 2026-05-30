'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Session, Theme } from '../lib/types'

type AppApi = {
  sessions: Session[]
  theme: Theme
  route: Route
  selectedSessionId: string | null
  assign: (id: string, agent: string) => void
  close: (id: string) => void
  sendMessage: (id: string, from: 'visitor' | 'agent', text: string) => void
  selectSession: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  sessions: [],
  theme: 'light',
  route: 'queue',
  selectedSessionId: null,
  assign: () => {},
  close: () => {},
  sendMessage: () => {},
  selectSession: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold sessions/theme/route/selection in state (seed 5 sessions), implement
  // assign (sets agent + active), close (sets closed), sendMessage, selectSession,
  // navigate, setTheme, and provide them through AppContext. The STUB below makes the app
  // mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
