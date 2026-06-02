'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Subscriber, PlanKey } from '../lib/types'
import { PLANS } from '../lib/plans'

type Ctx = {
  subscribers: Subscriber[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addSubscriber: (name: string, plan: PlanKey) => void
  removeSubscriber: (id: number) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Subscriber[] = [
  { id: 1, name: 'Alice', plan: 'starter', active: true },
  { id: 2, name: 'Bob', plan: 'pro', active: true },
  { id: 3, name: 'Carol', plan: 'enterprise', active: true },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(SEED)
  const [route, setRoute] = useState<Route>('subscribers')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addSubscriber(name: string, plan: PlanKey) {
    const n = name.trim()
    if (!n) return
    setSubscribers((s) => [...s, { id: nextId, name: n, plan, active: true }])
    setNextId((id) => id + 1)
  }

  function removeSubscriber(id: number) {
    setSubscribers((s) => s.filter((sub) => sub.id !== id))
  }

  function toggleActive(id: number) {
    setSubscribers((s) =>
      s.map((sub) => (sub.id === id ? { ...sub, active: !sub.active } : sub))
    )
  }

  const value: Ctx = {
    subscribers,
    route,
    theme,
    navigate: setRoute,
    addSubscriber,
    removeSubscriber,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
