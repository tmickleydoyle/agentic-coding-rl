'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Stakeholder, Route, Influence } from '../lib/types'

type Ctx = {
  stakeholders: Stakeholder[]
  filter: Influence | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addStakeholder: (name: string, influence: Influence) => void
  removeStakeholder: (id: number) => void
  toggleSupportive: (id: number) => void
  setFilter: (f: Influence | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [filter, setFilter] = useState<Influence | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('stakeholders')
  const [nextId, setNextId] = useState(1)

  function addStakeholder(name: string, influence: Influence) {
    const n = name.trim()
    if (!n) return
    setStakeholders((s) => [...s, { id: nextId, name: n, influence, supportive: false }])
    setNextId((i) => i + 1)
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
    filter,
    theme,
    route,
    navigate: setRoute,
    addStakeholder,
    removeStakeholder,
    toggleSupportive,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
