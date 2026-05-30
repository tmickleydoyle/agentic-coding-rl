'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Deal, Lead, Route, StatusFilter, Theme } from '../lib/types'

type AppApi = {
  leads: Lead[]
  deals: Deal[]
  theme: Theme
  route: Route
  statusFilter: StatusFilter
  selectedLeadId: string | null
  qualifyLead: (id: string) => void
  loseLead: (id: string) => void
  setScore: (id: string, score: number) => void
  convertLead: (id: string, value: number) => void
  selectLead: (id: string) => void
  setStatusFilter: (f: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  leads: [],
  deals: [],
  theme: 'light',
  route: 'leads',
  statusFilter: 'all',
  selectedLeadId: null,
  qualifyLead: () => {},
  loseLead: () => {},
  setScore: () => {},
  convertLead: () => {},
  selectLead: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold leads/deals/theme/route/statusFilter/selectedLeadId in state (seed 4 leads
  // + 1 deal), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
