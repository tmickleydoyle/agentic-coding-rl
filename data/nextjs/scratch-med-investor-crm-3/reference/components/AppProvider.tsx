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
  updateStage: (id: number, stage: Stage) => void
  setFilter: (f: Stage | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Investor[] = [
  { id: 1, firm: 'Sequoia', stage: 'committed', checkSize: 500000 },
  { id: 2, firm: 'Accel', stage: 'pitched', checkSize: 250000 },
  { id: 3, firm: 'Y Combinator', stage: 'intro', checkSize: 125000 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [investors, setInvestors] = useState<Investor[]>(SEED)
  const [filter, setFilter] = useState<Stage | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('investors')
  const [nextId, setNextId] = useState(4)

  function addInvestor(firm: string, stage: Stage, checkSize: number) {
    const f = firm.trim()
    if (!f || !Number.isFinite(checkSize) || checkSize <= 0) return
    setInvestors((prev) => [...prev, { id: nextId, firm: f, stage, checkSize }])
    setNextId((n) => n + 1)
  }

  function removeInvestor(id: number) {
    setInvestors((prev) => prev.filter((inv) => inv.id !== id))
  }

  function updateStage(id: number, stage: Stage) {
    setInvestors((prev) => prev.map((inv) => inv.id === id ? { ...inv, stage } : inv))
  }

  const value: Ctx = {
    investors,
    filter,
    theme,
    route,
    navigate: setRoute,
    addInvestor,
    removeInvestor,
    updateStage,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
