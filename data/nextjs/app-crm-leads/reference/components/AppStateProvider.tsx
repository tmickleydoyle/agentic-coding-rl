'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Deal, Lead, LeadStatus, Route, StatusFilter, Theme } from '../lib/types'

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

const SEED_LEADS: Lead[] = [
  { id: 'l1', name: 'Ada Byron', source: 'web', score: 80, status: 'new' },
  { id: 'l2', name: 'Grace Hopper', source: 'referral', score: 60, status: 'qualified' },
  { id: 'l3', name: 'Linus T', source: 'event', score: 30, status: 'new' },
  { id: 'l4', name: 'Margaret H', source: 'web', score: 90, status: 'converted' },
]

const SEED_DEALS: Deal[] = [{ id: 'd1', leadId: 'l4', title: 'Margaret H deal', value: 5000 }]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS)
  const [deals, setDeals] = useState<Deal[]>(SEED_DEALS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('leads')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [nextDealId, setNextDealId] = useState(2)

  const value = useMemo<AppApi>(() => {
    const setStatus = (id: string, status: LeadStatus) => {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    }

    const qualifyLead = (id: string) => setStatus(id, 'qualified')
    const loseLead = (id: string) => setStatus(id, 'lost')

    const setScore = (id: string, score: number) => {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, score } : l)))
    }

    const convertLead = (id: string, dealValue: number) => {
      const lead = leads.find((l) => l.id === id)
      if (!lead) return
      const dealId = `d${nextDealId}`
      setNextDealId((n) => n + 1)
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'converted' } : l)))
      setDeals((prev) => [
        ...prev,
        { id: dealId, leadId: id, title: `${lead.name} deal`, value: dealValue },
      ])
    }

    const selectLead = (id: string) => {
      setSelectedLeadId(id)
      setRoute('lead-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      leads,
      deals,
      theme,
      route,
      statusFilter,
      selectedLeadId,
      qualifyLead,
      loseLead,
      setScore,
      convertLead,
      selectLead,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [leads, deals, theme, route, statusFilter, selectedLeadId, nextDealId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
