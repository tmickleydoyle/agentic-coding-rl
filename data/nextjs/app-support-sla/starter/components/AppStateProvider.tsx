'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Theme, Ticket } from '../lib/types'

type AppApi = {
  tickets: Ticket[]
  theme: Theme
  route: Route
  selectedTicketId: string | null
  respond: (id: string) => void
  escalate: (id: string) => void
  selectTicket: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  tickets: [],
  theme: 'light',
  route: 'tickets',
  selectedTicketId: null,
  respond: () => {},
  escalate: () => {},
  selectTicket: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold tickets/theme/route/selection in state (seed 5 tickets), implement
  // respond/escalate/selectTicket/navigate/setTheme (escalate bumps priority + sets
  // escalated), and provide them through AppContext. The STUB below makes the app mount but
  // does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
