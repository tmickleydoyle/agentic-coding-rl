'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Plan, Route, Subscriber } from '../lib/types'
import { PLAN_PRICE } from '../lib/types'

type Ctx = {
  subscribers: Subscriber[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addSubscriber: (name: string, plan: Plan) => void
  toggleActive: (id: number) => void
  removeSubscriber: (id: number) => void
  toggleTheme: () => void
  mrr: number
  activeCount: number
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Subscriber[] = [
  { id: 1, name: 'Alice', plan: 'Pro', active: true },
  { id: 2, name: 'Bob', plan: 'Basic', active: true },
  { id: 3, name: 'Carol', plan: 'Pro', active: false },
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
    setNextId((i) => i + 1)
  }

  function toggleActive(id: number) {
    setSubscribers((s) => s.map((sub) => sub.id === id ? { ...sub, active: !sub.active } : sub))
  }

  function removeSubscriber(id: number) {
    setSubscribers((s) => s.filter((sub) => sub.id !== id))
  }

  const activeCount = subscribers.filter((s) => s.active).length
  const mrr = subscribers.reduce((sum, s) => s.active ? sum + PLAN_PRICE[s.plan] : sum, 0)

  const value: Ctx = {
    subscribers,
    theme,
    route,
    navigate: setRoute,
    addSubscriber,
    toggleActive,
    removeSubscriber,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    mrr,
    activeCount,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
