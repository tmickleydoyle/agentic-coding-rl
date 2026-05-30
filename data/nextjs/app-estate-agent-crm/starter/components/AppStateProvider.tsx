'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Lead, LeadStatus, Property, Route, StatusFilter, Theme } from '../lib/types'

type AppApi = {
  leads: Lead[]
  properties: Property[]
  theme: Theme
  route: Route
  selectedId: string | null
  statusFilter: StatusFilter
  setStatus: (id: string, status: LeadStatus) => void
  assignProperty: (id: string, propertyId: string | null) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
  openLead: (id: string) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  leads: [],
  properties: [],
  theme: 'light',
  route: 'leads',
  selectedId: null,
  statusFilter: 'all',
  setStatus: () => {},
  assignProperty: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
  openLead: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold leads/properties/theme/route/selectedId/statusFilter in state (seed 3 leads
  // + 2 properties), implement the actions, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useCrm(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useCrm must be used within an AppStateProvider')
  return v
}
