'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Investor, Route, Stage } from '../lib/types'

type Ctx = {
  investors: Investor[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addInvestor: (firm: string, checkSize: number, stage: Stage) => void
  removeInvestor: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('investors')
  const [nextId, setNextId] = useState(1)

  function addInvestor(firm: string, checkSize: number, stage: Stage) {
    const f = firm.trim()
    if (!f || checkSize <= 0) return
    setInvestors((prev) => [...prev, { id: nextId, firm: f, checkSize, stage }])
    setNextId((n) => n + 1)
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
    removeInvestor,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
