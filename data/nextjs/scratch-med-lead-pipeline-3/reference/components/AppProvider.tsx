'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lead, Route, Stage, StageFilter } from '../lib/types'

const SEED: Lead[] = [
  { id: 1, company: 'Acme Corp', stage: 'new', value: 5000 },
  { id: 2, company: 'Globex', stage: 'demo', value: 12000 },
  { id: 3, company: 'Initech', stage: 'won', value: 8000 },
]

type Ctx = {
  leads: Lead[]
  filter: StageFilter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addLead: (company: string, stage: Stage, value: number) => void
  deleteLead: (id: number) => void
  setFilter: (f: StageFilter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED)
  const [filter, setFilter] = useState<StageFilter>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('leads')
  const [nextId, setNextId] = useState(4)

  function addLead(company: string, stage: Stage, value: number) {
    const c = company.trim()
    if (!c || !(value > 0)) return
    setLeads((ls) => [...ls, { id: nextId, company: c, stage, value }])
    setNextId((n) => n + 1)
  }

  function deleteLead(id: number) {
    setLeads((ls) => ls.filter((l) => l.id !== id))
  }

  const value: Ctx = {
    leads,
    filter,
    theme,
    route,
    navigate: setRoute,
    addLead,
    deleteLead,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
