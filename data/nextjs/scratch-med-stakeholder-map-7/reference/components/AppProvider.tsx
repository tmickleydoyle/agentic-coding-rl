'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Stakeholder, Influence, Route } from '../lib/types'

type Ctx = {
  stakeholders: Stakeholder[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addStakeholder: (name: string, influence: Influence) => void
  removeStakeholder: (id: number) => void
  toggleSupportive: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('stakeholders')
  const [nextId, setNextId] = useState(1)

  function addStakeholder(name: string, influence: Influence) {
    const n = name.trim()
    if (!n) return
    setStakeholders((s) => [...s, { id: nextId, name: n, influence, supportive: true }])
    setNextId((x) => x + 1)
  }

  function removeStakeholder(id: number) {
    setStakeholders((s) => s.filter((x) => x.id !== id))
  }

  function toggleSupportive(id: number) {
    setStakeholders((s) =>
      s.map((x) => (x.id === id ? { ...x, supportive: !x.supportive } : x)),
    )
  }

  const value: Ctx = {
    stakeholders,
    theme,
    route,
    navigate: setRoute,
    addStakeholder,
    removeStakeholder,
    toggleSupportive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
