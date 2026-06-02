'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Subscriber, Plan } from '../lib/types'
import { PLAN_PRICE } from '../lib/plans'

type Ctx = {
  subscribers: Subscriber[]
  route: Route
  theme: 'light' | 'dark'
  filterInactive: boolean
  navigate: (r: Route) => void
  addSubscriber: (name: string, plan: Plan) => void
  toggleActive: (id: number) => void
  removeSubscriber: (id: number) => void
  toggleTheme: () => void
  toggleFilterInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Subscriber[] = [
  { id: 1, name: 'Acme Corp', plan: 'Pro', active: true },
  { id: 2, name: 'Globex', plan: 'Starter', active: true },
  { id: 3, name: 'Initech', plan: 'Enterprise', active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(SEED)
  const [route, setRoute] = useState<Route>('subscribers')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filterInactive, setFilterInactive] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addSubscriber(name: string, plan: Plan) {
    const n = name.trim()
    if (!n) return
    setSubscribers((s) => [...s, { id: nextId, name: n, plan, active: true }])
    setNextId((x) => x + 1)
  }

  function toggleActive(id: number) {
    setSubscribers((s) =>
      s.map((sub) => (sub.id === id ? { ...sub, active: !sub.active } : sub)),
    )
  }

  function removeSubscriber(id: number) {
    setSubscribers((s) => s.filter((sub) => sub.id !== id))
  }

  const value: Ctx = {
    subscribers,
    route,
    theme,
    filterInactive,
    navigate: setRoute,
    addSubscriber,
    toggleActive,
    removeSubscriber,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleFilterInactive: () => setFilterInactive((f) => !f),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
