'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Plan, Route, Subscriber } from '../lib/types'
import { PLAN_PRICE } from '../lib/types'

type Ctx = {
  subscribers: Subscriber[]
  theme: 'light' | 'dark'
  hideInactive: boolean
  route: Route
  navigate: (r: Route) => void
  addSubscriber: (name: string, plan: Plan) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
  toggleHideInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Subscriber[] = [
  { id: 1, name: 'Alice Chen', plan: 'Pro', active: true },
  { id: 2, name: 'Bob Smith', plan: 'Basic', active: true },
  { id: 3, name: 'Carol White', plan: 'Enterprise', active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideInactive, setHideInactive] = useState(false)
  const [route, setRoute] = useState<Route>('subscribers')
  const [nextId, setNextId] = useState(4)

  function addSubscriber(name: string, plan: Plan) {
    const n = name.trim()
    if (!n) return
    setSubscribers((s) => [...s, { id: nextId, name: n, plan, active: true }])
    setNextId((id) => id + 1)
  }

  function toggleActive(id: number) {
    setSubscribers((s) =>
      s.map((sub) => (sub.id === id ? { ...sub, active: !sub.active } : sub)),
    )
  }

  const value: Ctx = {
    subscribers,
    theme,
    hideInactive,
    route,
    navigate: setRoute,
    addSubscriber,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideInactive: () => setHideInactive((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
