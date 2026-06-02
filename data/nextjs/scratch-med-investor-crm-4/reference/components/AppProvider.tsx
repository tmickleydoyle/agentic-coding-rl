'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Investor, Route, Stage } from '../lib/types'

const SEED: Investor[] = [
  { id: 1, firm: 'Acme Ventures', stage: 'intro', checkSize: 25000 },
  { id: 2, firm: 'Blue Capital', stage: 'committed', checkSize: 100000 },
  { id: 3, firm: 'Crest Fund', stage: 'pitched', checkSize: 75000 },
]

type Ctx = {
  investors: Investor[]
  filter: Stage | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addInvestor: (firm: string, checkSize: number, stage: Stage) => void
  removeInvestor: (id: number) => void
  setFilter: (f: Stage | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [investors, setInvestors] = useState<Investor[]>(SEED)
  const [filter, setFilter] = useState<Stage | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('investors')
  const [nextId, setNextId] = useState(4)

  function addInvestor(firm: string, checkSize: number, stage: Stage) {
    const f = firm.trim()
    if (!f || checkSize <= 0) return
    setInvestors((prev) => [...prev, { id: nextId, firm: f, stage, checkSize }])
    setNextId((n) => n + 1)
  }

  function removeInvestor(id: number) {
    setInvestors((prev) => prev.filter((inv) => inv.id !== id))
  }

  const value: Ctx = {
    investors,
    filter,
    theme,
    route,
    navigate: setRoute,
    addInvestor,
    removeInvestor,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
