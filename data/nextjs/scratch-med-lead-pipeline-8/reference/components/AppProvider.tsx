'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lead, Route, Stage } from '../lib/types'

const SEED: Lead[] = [
  { id: 1, company: 'Acme Corp', stage: 'new', dealValue: 5000 },
  { id: 2, company: 'Beta LLC', stage: 'demo', dealValue: 12000 },
  { id: 3, company: 'Gamma Inc', stage: 'won', dealValue: 8000 },
]

type Ctx = {
  leads: Lead[]
  filter: 'all' | Stage
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addLead: (company: string, stage: Stage, dealValue: number) => void
  deleteLead: (id: number) => void
  setFilter: (f: 'all' | Stage) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED)
  const [filter, setFilter] = useState<'all' | Stage>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('leads')
  const [nextId, setNextId] = useState(4)

  function addLead(company: string, stage: Stage, dealValue: number) {
    const c = company.trim()
    if (!c || !Number.isFinite(dealValue) || dealValue <= 0) return
    setLeads((prev) => [...prev, { id: nextId, company: c, stage, dealValue }])
    setNextId((n) => n + 1)
  }

  function deleteLead(id: number) {
    setLeads((prev) => prev.filter((l) => l.id !== id))
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
