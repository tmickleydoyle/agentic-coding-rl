'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Subscriber, Plan, Route } from '../lib/types'
import { PLAN_PRICE } from '../lib/plans'

type Ctx = {
  subscribers: Subscriber[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addSubscriber: (name: string, plan: Plan) => void
  toggleActive: (id: number) => void
  removeSubscriber: (id: number) => void
  resetSubscribers: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Subscriber[] = [
  { id: 1, name: 'Alice', plan: 'Pro', active: true },
  { id: 2, name: 'Bob', plan: 'Starter', active: true },
  { id: 3, name: 'Carol', plan: 'Enterprise', active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('subscribers')
  const [nextId, setNextId] = useState(4)

  function addSubscriber(name: string, plan: Plan) {
    const n = name.trim()
    if (!n) return
    setSubscribers((s) => [...s, { id: nextId, name: n, plan, active: true }])
    setNextId((id) => id + 1)
  }

  function toggleActive(id: number) {
    setSubscribers((s) => s.map((sub) => sub.id === id ? { ...sub, active: !sub.active } : sub))
  }

  function removeSubscriber(id: number) {
    setSubscribers((s) => s.filter((sub) => sub.id !== id))
  }

  function resetSubscribers() {
    setSubscribers([])
    setNextId(1)
  }

  const value: Ctx = {
    subscribers,
    theme,
    route,
    navigate: setRoute,
    addSubscriber,
    toggleActive,
    removeSubscriber,
    resetSubscribers,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
