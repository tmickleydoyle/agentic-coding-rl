'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Investor, Route, Stage } from '../lib/types'

type Ctx = {
  investors: Investor[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addInvestor: (firm: string, stage: Stage, checkSize: number) => void
  updateStage: (id: number, stage: Stage) => void
  removeInvestor: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Investor[] = [
  { id: 1, firm: 'Acme Ventures', stage: 'intro', checkSize: 25000 },
  { id: 2, firm: 'Blue Horizon', stage: 'pitched', checkSize: 100000 },
  { id: 3, firm: 'Crestwood Capital', stage: 'committed', checkSize: 500000 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [investors, setInvestors] = useState<Investor[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('investors')
  const [nextId, setNextId] = useState(4)

  function addInvestor(firm: string, stage: Stage, checkSize: number) {
    const f = firm.trim()
    if (!f || checkSize <= 0) return
    setInvestors((prev) => [...prev, { id: nextId, firm: f, stage, checkSize }])
    setNextId((n) => n + 1)
  }

  function updateStage(id: number, stage: Stage) {
    setInvestors((prev) => prev.map((inv) => (inv.id === id ? { ...inv, stage } : inv)))
  }

  function removeInvestor(id: number) {
    setInvestors((prev) => prev.filter((inv) => inv.id !== id))
  }

  const value: Ctx = {
    investors,
    theme,
    route,
    navigate: setRoute,
    addInvestor,
    updateStage,
    removeInvestor,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
