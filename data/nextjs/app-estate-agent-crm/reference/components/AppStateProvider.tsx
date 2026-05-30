'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PROPERTIES: Property[] = [
  { id: 'p1', address: '12 Oak St' },
  { id: 'p2', address: '500 Pine Ave' },
]

const SEED_LEADS: Lead[] = [
  { id: 'l1', name: 'Ava Stone', status: 'new', propertyId: null },
  { id: 'l2', name: 'Ben Cole', status: 'touring', propertyId: 'p1' },
  { id: 'l3', name: 'Cara Diaz', status: 'offer', propertyId: 'p2' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS)
  const [properties] = useState<Property[]>(SEED_PROPERTIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('leads')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const value = useMemo<AppApi>(() => {
    const setStatus = (id: string, status: LeadStatus) => {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    }

    const assignProperty = (id: string, propertyId: string | null) => {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, propertyId } : l)))
    }

    const navigate = (next: Route) => setRoute(next)

    const openLead = (id: string) => {
      setSelectedId(id)
      setRoute('lead-detail')
    }

    return {
      leads,
      properties,
      theme,
      route,
      selectedId,
      statusFilter,
      setStatus,
      assignProperty,
      setStatusFilter,
      setTheme,
      navigate,
      openLead,
    }
  }, [leads, properties, theme, route, selectedId, statusFilter])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useCrm(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useCrm must be used within an AppStateProvider')
  return v
}
