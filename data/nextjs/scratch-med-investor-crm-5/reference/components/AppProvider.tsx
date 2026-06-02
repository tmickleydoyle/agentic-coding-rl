'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Investor, Route, Stage } from '../lib/types'

type Ctx = {
  investors: Investor[]
  filter: Stage | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addInvestor: (firm: string, stage: Stage, checkSize: number) => void
  removeInvestor: (id: number) => void
  setFilter: (f: Stage | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [filter, setFilter] = useState<Stage | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('investors')
  const [nextId, setNextId] = useState(1)

  function addInvestor(firm: string, stage: Stage, checkSize: number) {
    const f = firm.trim()
    if (!f || !(checkSize > 0)) return
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
