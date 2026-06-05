'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lead, Stage, Route } from '../lib/types'

type Ctx = {
  leads: Lead[]
  filter: Stage | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addLead: (company: string, stage: Stage, value: number) => void
  deleteLead: (id: number) => void
  setFilter: (f: Stage | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Lead[] = [
  { id: 1, company: 'Acme Corp', stage: 'new', value: 5000 },
  { id: 2, company: 'Globex', stage: 'demo', value: 12000 },
  { id: 3, company: 'Initech', stage: 'won', value: 8000 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED)
  const [filter, setFilter] = useState<Stage | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('leads')
  const [nextId, setNextId] = useState(4)

  function addLead(company: string, stage: Stage, value: number) {
    const c = company.trim()
    if (!c || value <= 0) return
    setLeads((l) => [...l, { id: nextId, company: c, stage, value }])
    setNextId((n) => n + 1)
  }

  function deleteLead(id: number) {
    setLeads((l) => l.filter((x) => x.id !== id))
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
